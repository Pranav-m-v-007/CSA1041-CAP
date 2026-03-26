pipeline {
    agent any

    stages {

        stage('Pull Image') {
            steps {
                bat 'docker pull pranavmv007/app:latest'
            }
        }

        stage('Stop Old Container') {
            steps {
                bat 'docker stop myapp || exit 0'
                bat 'docker rm myapp || exit 0'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 3000:3000 --name myapp pranavmv007/app:latest'
            }
        }
    }
}