#!/bin/bash

NAMESPACE=staging-bo-sellcoda
SECRET_NAME=gcr-image-pull-secret
SECRET_COUNT=$(kubectl get secret -n ${NAMESPACE} ${SECRET_NAME} | grep ${SECRET_NAME} | wc -l)

if [ "${SECRET_COUNT}" == '1' ]; then
# Already exist so delete the existing one first
    echo "Secret count = [${SECRET_COUNT}], deleting secret ${SECRET_NAME} before creating the new one"
    kubectl delete secret ${SECRET_NAME} -n ${NAMESPACE}
fi