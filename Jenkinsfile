#!groovy
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def label = "frontend-${UUID.randomUUID().toString()}"
podTemplate(label: label, yaml: """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: some-label-value
spec:
  volumes:
  - name: dockersock
    hostPath:
      path: /var/run/docker.sock
  containers:
  - name: docker
    image: docker
    volumeMounts:
      - name: dockersock
        mountPath: "/var/run/docker.sock"
    command:
    - cat
    tty: true
  - name: node
    image: node
    command:
    - cat
    tty: true
"""
)
	{
		node(label) {
			properties([disableConcurrentBuilds()])
			stage('checkout') {
			    if (env.BRANCH_NAME != 'master') {
                    return
                }

				checkout scm

				container('node') {}

				container('docker') {
              env.DOCKER_TAG = "${BRANCH_NAME}_${BUILD_NUMBER}"
              stage('build') {
                  sh 'docker build --build-arg CACHE_DATE=\"$(date)\" -f install/Dockerfile -t localhost:32000/worker-cli:${DOCKER_TAG} .'
              }
              stage('publish') {
                  sh 'docker push localhost:32000/worker-cli:${DOCKER_TAG}'
                  sh "docker login -u elasticdataio -p '!Prisoner31!'"
                  sh 'docker tag localhost:32000/worker-cli:${DOCKER_TAG} elasticdataio/worker-cli:0.1'
                  sh 'docker push elasticdataio/worker-cli:0.1'
              }
				}
			}
		}
	}
