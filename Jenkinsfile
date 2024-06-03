pipeline {
    agent any
    stages {

        //CLONANDO REPOSITORIO
        stage('Checkout') {
            steps {
                echo 'Clonando o repositório...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'Develop']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    submoduleCfg: [],
                    userRemoteConfigs: [[url: 'http://172.20.6.56:8082/Front_VVE.git']]
                ])
            }
        }

        //BUILDANDO O PROJETO
        stage('Build') {
            steps {
                echo 'Buildando...'
            }
        }

        //TESTANDO O PROJETO
        stage('Test') {
            steps {
                echo 'Testando...'
            }
        }

        //VERIFICANDO AS MUDANCAS DO ULTIMO COMMIT
        stage('Changes') {
            steps {
                echo 'Exibindo as mudancas do ultimo commit:'
                bat 'git show HEAD'
            }
        }

        //BACKUP DO PROJETO QUE ESTÁ EM PRODUÇÃO ANTES DE FAZER O DEPLOY
        stage('Backup') {
            steps {
                script {
                    echo 'Fazendo backup do projeto...'

                    // Criar uma pasta de backup com a data atual
                    def currentDate = new Date().format('yyyyMMdd_HHmmss')
                    def backupPath = "D:\\Sites\\NewVVE\\Backups\\BackupFront\\${currentDate}"
                    bat "mkdir ${backupPath}"

                    // Copiar os arquivos da pasta Publish para a pasta de backup
                    bat "xcopy D:\\Sites\\NewVVE\\NewVVE_Front ${backupPath} /E /I /Y"
                }
            }
        }

        //APROVANDO O DEPLOY
        // stage('Approve Deploy?') {
        //     steps {
        //         echo 'Aguardando aprovacao...'
        //         input "Aprovar a pipeline para Deploy?"
        //     }
        // }

        // PARA PARAR O IIS
        stage('Stop IIS') {
          steps {
            script {
              bat '"C:\\Windows\\System32\\inetsrv\\appcmd.exe" stop apppool /apppool.name:"NewVVE_Front"'
            }
          }
        }

        //DEPLOY DO PROJETO
        stage('Publish') {
            steps {
                echo 'Deploying...'
                // Copia os arquivos da pasta 'Deploy/vve' do repositório para a pasta de destino
                bat 'xcopy /Y /S "deploy\\vve\\*" "D:\\Sites\\NewVVE\\NewVVE_Front"'
            }
        }

        // PARA INICIAR O IIS
        stage('Start IIS') {
            steps {
                script {
                    bat '"C:\\Windows\\System32\\inetsrv\\appcmd.exe" start apppool /apppool.name:"NewVVE_Front"'
                }
            }
        }

        //PARA LIMPAR O CACHE DO IIS
        stage('Clear IIS Cache') {
            steps {
                script {
                    bat '"C:\\Windows\\System32\\inetsrv\\appcmd.exe" recycle apppool /apppool.name:"NewVVE_Front"'
                }
            }
        }
    }
}
