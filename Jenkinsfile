pipeline {
    agent any

    environment {
        NODE_VERSION     = '20'
        DOCKER_REGISTRY  = 'docker.io'
        IMAGE_NAME       = 'tiptopgame'
        APP_NAME         = 'tip-top-game'
        DOMAIN           = 'dsp5-archi-f24a-15m-g3.fr'
        DOCKER_NETWORK   = 'tiptopgame_net'
        TIMEZONE         = 'Europe/Paris'
        TRAEFIK_EMAIL    = 'thierry.temgoua98@gmail.com'
        SONARQUBE_TOKEN  = ''
    }

    stages {
        stage('Clean & Checkout') {
            steps {
                deleteDir()
                checkout scm
                echo "[DEBUG] 📁 Workspace après checkout :"
                sh 'ls -alR'
            }
        }

        stage('Set NODE_ENV') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'prod') {
                        env.NODE_ENV = 'production'
                    } else if (env.BRANCH_NAME == 'preprod') {
                        env.NODE_ENV = 'preprod'
                    } else {
                        env.NODE_ENV = 'development'
                    }
                    echo "🔧 NODE_ENV set to: ${env.NODE_ENV}"
                }
            }
        }

        stage('Ensure Docker Network') {
            steps {
                sh '''
                    if ! docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1; then
                        echo "[INFO] 🛠 Creating missing Docker network '${DOCKER_NETWORK}'..."
                        docker network create ${DOCKER_NETWORK}
                    else
                        echo "[INFO] ✅ Docker network '${DOCKER_NETWORK}' already exists."
                    fi
                '''
            }
        }

        stage('Start MongoDB Service for Tests') {
            steps {
                script {
                    echo "[INFO] Starting MongoDB container for testing..."

                    sh '''
                        if docker ps -a --filter "name=mongodb-test" --format "{{.Names}}" | grep -q "mongodb-test"; then
                            echo "[INFO] Removing existing mongodb-test container..."
                            docker rm -f mongodb-test || true
                        fi
                    '''
                    
                    sh '''
                        docker run -d --name mongodb-test \
                            --network ${DOCKER_NETWORK} \
                            -e MONGO_INITDB_ROOT_USERNAME=root \
                            -e MONGO_INITDB_ROOT_PASSWORD=password \
                            -e MONGO_INITDB_DATABASE=test_db \
                            mongo:6.0
                    '''
                }
            }
        }

        stage('Backend Unit Tests') {
            steps {
                script {
                    docker.image('node:20-bullseye').inside {
                        dir('backend') {
                            echo "📦 Installing backend deps"
                            sh 'apt-get update && apt-get install -y libcurl4' 
                            sh 'npm ci'
                            echo "🔧 Running backend tests with NODE_ENV=${env.NODE_ENV}"
                            sh "NODE_ENV=test npm run test"
                        }
                    }
                }
            }
        }

        stage('Frontend Unit Tests') {
            steps {
                script {
                    docker.image('node:20').inside {
                        dir('frontend') {
                            echo "📦 Installing frontend deps"
                            sh 'npm ci'
                            echo "🧪 Running frontend tests"
                            sh 'CI=true npm test -- --watchAll=false'
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        script {
                            sh """
                                docker run --rm \
                                    -e SONAR_HOST_URL=\$SONAR_HOST_URL \
                                    -e SONAR_AUTH_TOKEN=\$SONAR_AUTH_TOKEN \
                                    -v \$(pwd):/usr/src \
                                    sonarsource/sonar-scanner-cli:latest \
                                    -Dsonar.projectKey=tip-top-game \
                                    -Dsonar.sources=. \
                                    -Dsonar.login=\$SONAR_AUTH_TOKEN
                            """
                        }
                    }
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def timestamp = new Date().format("yyyyMMddHHmmss")
                        def tag = "${env.BRANCH_NAME}-${timestamp}"
                        env.DOCKER_TAG = tag

                        echo "[LOGIN] 🔐 Docker login before build"
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                        """

                        echo "[BUILD] 🐳 Building and pushing backend image..."
                        sh """
                            docker build -f backend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG ./backend
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG
                        """
                        
                        echo "[BUILD] 🐳 Building and pushing frontend image..."
                        sh """
                            docker build -f frontend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG ./frontend
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG
                        """
                    }
                }
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def backendName = "${IMAGE_NAME}-backend-${env.BRANCH_NAME}"
                        def frontendName = "${IMAGE_NAME}-frontend-${env.BRANCH_NAME}"

                        sh """
                            echo "[CLEANUP] 🧹 Removing old containers if any..."
                            docker rm -f ${backendName} || true
                            docker rm -f ${frontendName} || true

                            echo "[DEPLOY] 🚀 Running backend container..."
                            docker run -d \
                                --env-file ${env.ENV_FILE} \
                                --network ${DOCKER_NETWORK} \
                                --name ${backendName} \
                                $DOCKER_REGISTRY/${DOCKER_USER}/${IMAGE_NAME}-backend:$DOCKER_TAG

                            echo "[DEPLOY] 🚀 Running frontend container..."
                            docker run -d \
                                --network ${DOCKER_NETWORK} \
                                --name ${frontendName} \
                                $DOCKER_REGISTRY/${DOCKER_USER}/${IMAGE_NAME}-frontend:$DOCKER_TAG
                        """
                    }
                }
            }
        }

    }

    post {
        always {
            echo "🧹 Global cleanup..."
            script {
                def backendName = "${IMAGE_NAME}-backend-${env.BRANCH_NAME}"
                def frontendName = "${IMAGE_NAME}-frontend-${env.BRANCH_NAME}"
                sh """
                    docker rm -f ${backendName} || true
                    docker rm -f ${frontendName} || true
                    docker rm -f mongodb-test || true
                    docker logout || true
                    docker system prune -f || true
                """
            }
            junit allowEmptyResults: true, testResults: '**/*-test-results.xml'
        }

        success {
            echo "✅ Pipeline succeeded."
        }

        failure {
            echo "❌ Pipeline failed."
        }
    }
}