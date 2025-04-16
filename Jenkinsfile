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

                    def containerName = "mongodb-test-${BUILD_ID}"

                    withEnv(["MONGO_CONTAINER_NAME=${containerName}"]) {
                        sh '''
                            echo "[DEBUG] Container name: $MONGO_CONTAINER_NAME"

                            EXISTING_CONTAINER=$(docker ps -a --filter "name=$MONGO_CONTAINER_NAME" --format "{{.Names}}")
                            if [ -n "$EXISTING_CONTAINER" ]; then
                                echo "[INFO] Removing existing mongodb-test container..."
                                docker rm -f $EXISTING_CONTAINER || true
                            fi

                            while docker ps -a --filter "name=$MONGO_CONTAINER_NAME" --format "{{.Names}}" | grep -q "$MONGO_CONTAINER_NAME"; do
                                echo "[INFO] Waiting for $MONGO_CONTAINER_NAME container to be removed..."
                                sleep 2
                            done

                            docker run -d --name $MONGO_CONTAINER_NAME \
                                --network ${DOCKER_NETWORK} \
                                -e MONGO_INITDB_ROOT_USERNAME=root \
                                -e MONGO_INITDB_ROOT_PASSWORD=password \
                                -e MONGO_INITDB_DATABASE=test_db \
                                mongo:6.0
                        '''
                    }
                }
            }
        }

        stage('Backend Unit Tests') {
            steps {
                script {
                    echo "[INFO] 📦 Installing backend dependencies..."

                    // Mise à jour des dépôts et installation des dépendances système
                    sh '''
                        apt-get update -y
                        dpkg -l | grep -qw apt-utils || apt-get install -y apt-utils
                        apt-get install -y libssl3 curl git ca-certificates gnupg

                        echo "[INFO] 🧩 Adding MongoDB shell repository..."
                        curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
                        echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" > /etc/apt/sources.list.d/mongodb-org-6.0.list
                        apt-get update -y
                        apt-get install -y mongodb-org-shell

                        echo "[INFO] ✅ Dependencies installed."
                    '''

                    // Installation de Node.js et npm
                    echo "[INFO] Installing Node.js and npm..."
                    sh '''
                        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 
                        apt-get install -y nodejs
                        node -v
                        npm -v
                    '''

                    echo "[INFO] 🧪 Running backend unit tests..."
                    sh '''
                        npm install
                        npm run test
                    '''
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
                            sh '''
                                docker run --rm \
                                    -e SONAR_HOST_URL=$SONAR_HOST_URL \
                                    -e SONAR_AUTH_TOKEN=$SONAR_AUTH_TOKEN \
                                    -v $(pwd):/usr/src \
                                    sonarsource/sonar-scanner-cli:latest \
                                    -Dsonar.projectKey=tip-top-game \
                                    -Dsonar.sources=. \
                                    -Dsonar.login=$SONAR_AUTH_TOKEN
                            '''
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

                        echo "[BUILD] 🐳 Building and pushing backend image..."
                        sh '''
                            docker build -f backend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG ./backend
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG
                        '''

                        echo "[BUILD] 🐳 Building and pushing frontend image..."
                        sh '''
                            docker build -f frontend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG ./frontend
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG
                        '''
                    }
                }
            }
        }

        stage('Deploy Docker Containers') {
            steps {
                script {
                    def backendName = "${IMAGE_NAME}-backend-${env.BRANCH_NAME}"
                    def frontendName = "${IMAGE_NAME}-frontend-${env.BRANCH_NAME}"

                    sh '''
                        echo "[CLEANUP] 🧹 Removing old containers if any..."
                        docker rm -f ${backendName} || true
                        docker rm -f ${frontendName} || true

                        echo "[DEPLOY] 🚀 Running backend container..."
                        docker run -d \
                            --env-file ${env.ENV_FILE} \
                            --network ${DOCKER_NETWORK} \
                            --name ${backendName} \
                            $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG

                        echo "[DEPLOY] 🚀 Running frontend container..."
                        docker run -d \
                            --network ${DOCKER_NETWORK} \
                            --name ${frontendName} \
                            $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG
                    '''
                }
            }
        }

        stage('Backup MongoDB') {
            steps {
                script {
                    def backendName = "${IMAGE_NAME}-backend-${env.BRANCH_NAME}"
                    sh '''
                        echo "[INFO] 📦 Creating MongoDB backup..."
                        docker exec ${backendName} \
                            mongodump --archive=/backup/${IMAGE_NAME}-${BRANCH_NAME}.gz --gzip || echo '[WARN] Backup failed (maybe mongod not running?)'
                    '''
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
                sh '''
                    docker rm -f ${backendName} || true
                    docker rm -f ${frontendName} || true
                    docker rm -f mongodb-test-${BUILD_ID} || true
                    docker logout || true
                    docker system prune -f || true
                '''
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
