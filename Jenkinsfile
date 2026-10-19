pipeline {
    agent any
    options { timestamps() }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Docker Image') {
            steps { bat 'docker compose build' }
        }
        stage('Test') {
            steps { bat 'docker compose run --rm --no-deps app npm test' }
        }
        stage('Deploy Local') {
            steps { bat 'docker compose up -d' }
        }
        stage('Verify') {
            steps { bat 'docker compose ps' }
        }
    }

    post {
        always {
            echo 'Pipeline selesai. Periksa status stage dan Console Output.'
        }
    }
}
