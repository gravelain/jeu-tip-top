pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
    }

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
                    env.NODE_ENV = (env.BRANCH_NAME == 'prod') ? 'production' :
                                   (env.BRANCH_NAME == 'preprod') ? 'preprod' : 'development'
                    env.ENV_FILE = ".env.${env.NODE_ENV}"
                    echo "🔧 NODE_ENV set to: ${env.NODE_ENV}"
                    echo "📄 ENV_FILE: ${env.ENV_FILE}"
                }
            }
        }

        stage('Check Docker Availability') {
            steps {
                sh '''
                    echo "[CHECK] 🔍 Checking Docker..."
                    docker --version || (echo "[ERROR] ❌ Docker non disponible sur l'agent !" && exit 1)
                '''
            }
        }

        stage('Ensure Docker Network') {
            steps {
                sh '''
                    if ! docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1; then
                        echo "[INFO] 🛠️ Creating missing Docker network '${DOCKER_NETWORK}'..."
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
                    def containerName = "mongodb-test-${BUILD_ID}"
                    withEnv(["MONGO_CONTAINER_NAME=${containerName}"]) {
                        sh '''
                            echo "[DEBUG] Container name: $MONGO_CONTAINER_NAME"

                            docker rm -f $MONGO_CONTAINER_NAME || true

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
                    sh '''
                        apt-get update -y

                        while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
                            echo "[WAIT] 🔄 Un processus APT est en cours. En attente..."
                            sleep 5
                        done

                        DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
                        apt-get install -y apt-utils libssl3 curl git ca-certificates gnupg

                        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                        DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs

                        node -v
                        npm -v

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

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def timestamp = new Date().format("yyyyMMddHHmmss")
                        env.DOCKER_TAG = "${env.BRANCH_NAME}-${timestamp}"

                        echo "[BUILD] 🐳 Building and pushing backend image..."
                        sh '''
                            docker build -f backend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG ./backend
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG
                            echo "[INFO] ✅ Backend image: $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG"
                        '''

                        echo "[BUILD] 🐳 Building and pushing frontend image..."
                        sh '''
                            docker build -f frontend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG ./frontend
                            docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG
                            echo "[INFO] ✅ Frontend image: $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG"
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
                        echo "[CLEANUP] 🧹 Removing old containers..."
                        docker rm -f ${backendName} || true
                        docker rm -f ${frontendName} || true

                        echo "[DEPLOY] 🚀 Running backend container..."
                        docker run -d \
                            --env-file ${ENV_FILE} \
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
                        mkdir -p ./mongo_backups
                        docker exec ${backendName} mongodump --archive=/tmp/backup.gz --gzip || echo '[WARN] Backup failed.'
                        docker cp ${backendName}:/tmp/backup.gz ./mongo_backups/${IMAGE_NAME}-${BRANCH_NAME}-$(date +%F-%H%M%S).gz || echo '[WARN] No backup to copy.'
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
                    docker image prune -af || true
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
