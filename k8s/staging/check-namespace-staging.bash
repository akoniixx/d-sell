#!/bin/bash

NAMESPACE=staging-bo-sellcoda

# Check if the namespace exists
if kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
  echo "Namespace $NAMESPACE already exists."
else
  echo "Creating namespace $NAMESPACE..."
  kubectl create namespace $NAMESPACE
fi