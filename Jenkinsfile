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
        DOCKER_USER      = ''  // Variable DOCKER_USER définie globalement
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

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        // Maintenant la variable DOCKER_USER est définie globalement et accessible
                        env.DOCKER_USER = DOCKER_USER  // Affectation globale
                        sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    }
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

        stage('Set Environment File') {
            steps {
                script {
                    def envMap = [
                        'develop' : '.env.dev',
                        'preprod' : '.env.preprod',
                        'prod'    : '.env.prod'
                    ]
                    env.ENV_FILE = envMap.get(env.BRANCH_NAME, '.env.dev')
                    echo "🔧 Using env file: ${env.ENV_FILE}"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def timestamp = new Date().format("yyyyMMddHHmmss")
                    def tag = "${env.BRANCH_NAME}-${timestamp}"
                    env.DOCKER_TAG = tag

                    echo "[BUILD] 🐳 Building backend..."
                    // Vérification du Docker User
                    echo "[DEBUG] DOCKER_USER is: ${env.DOCKER_USER}"
                    sh "docker build -f backend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG ./backend"

                    echo "[BUILD] 🐳 Building frontend..."
                    sh "docker build -f frontend/Dockerfile.prod -t $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG ./frontend"
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                sh "docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG"
                sh "docker push $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG"
            }
        }

        stage('Deploy Docker Containers') {
            steps {
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
                            $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-backend:$DOCKER_TAG

                        echo "[DEPLOY] 🚀 Running frontend container..."
                        docker run -d \
                            --network ${DOCKER_NETWORK} \
                            --name ${frontendName} \
                            $DOCKER_REGISTRY/$DOCKER_USER/${IMAGE_NAME}-frontend:$DOCKER_TAG
                    """
                }
            }
        }

        stage('Backup MongoDB') {
            steps {
                script {
                    def backendName = "${IMAGE_NAME}-backend-${env.BRANCH_NAME}"
                    sh """
                        echo "[INFO] 📦 Creating MongoDB backup..."
                        docker exec ${backendName} \
                            mongodump --archive=/backup/${IMAGE_NAME}-${BRANCH_NAME}.gz --gzip || echo '[WARN] Backup failed (maybe mongod not running?)'
                    """
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
