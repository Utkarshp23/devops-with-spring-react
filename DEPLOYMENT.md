# Deployment and Debugging Summary

## Prerequisites

1. **Google Cloud Account**: Sign up for a free account at [Google Cloud](https://cloud.google.com/).
2. **Google Cloud SDK**: Download and install the Google Cloud SDK from [here](https://cloud.google.com/sdk/docs/install).
3. **Docker**: Ensure Docker is installed and running on your machine.

## Step-by-Step Guide

### 1. Set Up Google Cloud Platform (GCP)

1. **Initialize Google Cloud SDK**:
    ```sh
    gcloud init
    ```

2. **Create a Google Cloud Project**:
    - Create a new project in the Google Cloud Console.

3. **Set the Project ID**:
    ```sh
    gcloud config set project your-project-id
    ```

4. **Enable Required APIs**:
    - Enable the Kubernetes Engine API and Cloud Build API in the Google Cloud Console.

### 2. Set Up Google Kubernetes Engine (GKE)

1. **Create a GKE Cluster**:
    ```sh
    gcloud container clusters create my-cluster --zone us-central1-a --num-nodes=1 --disk-type=pd-standard --disk-size=50
    ```

2. **Get Cluster Credentials**:
    ```sh
    gcloud container clusters get-credentials my-cluster --zone us-central1-a
    ```

3. **Install `gke-gcloud-auth-plugin`**:
    - Follow the instructions provided in the [Google Cloud documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin) to install the `gke-gcloud-auth-plugin`.

### 3. Build Docker Images and Push to Google Container Registry (GCR)

1. **Build and Push Spring Boot Docker Image**:
    ```sh
    docker build -t gcr.io/your-project-id/spring-app:latest -f dock/Dockerfile .
    docker push gcr.io/your-project-id/spring-app:latest
    ```

2. **Build and Push React Docker Image**:
    ```sh
    docker build -t gcr.io/your-project-id/react-app:latest -f react-app/Dockerfile .
    docker push gcr.io/your-project-id/react-app:latest
    ```

### 4. Create Kubernetes Secrets for GCR Authentication

1. **Create the Secret**:
    ```sh
    kubectl create secret docker-registry gcr-json-key \
      --docker-server=https://gcr.io \
      --docker-username=_json_key \
      --docker-password="$(gcloud auth print-access-token)" \
      --docker-email=your-email@example.com
    ```

### 5. Deploy Applications to GKE

1. **Create Kubernetes Deployment and Service for Spring Boot**:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-app
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: spring-app
      template:
        metadata:
          labels:
            app: spring-app
        spec:
          containers:
          - name: spring-app
            image: gcr.io/your-project-id/spring-app:latest
            ports:
            - containerPort: 8080
          imagePullSecrets:
          - name: gcr-json-key
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: spring-app-service
    spec:
      type: LoadBalancer
      selector:
        app: spring-app
      ports:
      - protocol: TCP
        port: 80
        targetPort: 8080
    ```

2. **Create Kubernetes Deployment and Service for React**:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: react-app
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: react-app
      template:
        metadata:
          labels:
            app: react-app
        spec:
          containers:
          - name: react-app
            image: gcr.io/your-project-id/react-app:latest
            ports:
            - containerPort: 3000
          imagePullSecrets:
          - name: gcr-json-key
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: react-app-service
    spec:
      type: LoadBalancer
      selector:
        app: react-app
      ports:
      - protocol: TCP
        port: 80
        targetPort: 3000
    ```

3. **Apply the Deployment Files**:
    ```sh
    kubectl apply -f k8s/spring-app-deployment.yaml
    kubectl apply -f k8s/react-app-deployment.yaml
    ```

### 6. Verify Deployment

1. **Get the Services**:
    ```sh
    kubectl get services
    ```

2. **Check the External IPs**:
    - Ensure that the `EXTERNAL-IP` column shows the external IP addresses assigned to your services.

3. **Access the Applications**:
    - Use the external IP addresses assigned to the services to access the applications in your web browser.

    ```sh
    http://<spring-app-external-ip>
    http://<react-app-external-ip>
    ```

### 7. Debugging Steps

1. **Check Service Status**:
    - Ensure that the services are running and have the correct external IP addresses assigned.

2. **Check Firewall Rules**:
    - Ensure that there are firewall rules allowing incoming traffic on ports 80 and 8080.

3. **Check Network Policies**:
    - Ensure that there are no network policies blocking traffic to the services.

4. **Check Network Connectivity**:
    - Verify that the network connectivity between the React application and the Spring Boot service is working:
      ```sh
      kubectl exec -it <react-app-pod-name> -- curl -I http://<spring-app-external-ip>/test
      ```

5. **Update CORS Configuration**:
    - Ensure that the CORS configuration in the Spring Boot application allows requests from the React application's external IP address.

### 8. Set Up CI/CD Pipeline with Google Cloud Build

1. **Create a Cloud Build Configuration File**:

    ```yaml
    steps:
      - name: 'gcr.io/cloud-builders/docker'
        args: ['build', '-t', 'gcr.io/$PROJECT_ID/spring-app:latest', '-f', 'dock/Dockerfile', '.']
      - name: 'gcr.io/cloud-builders/docker'
        args: ['push', 'gcr.io/$PROJECT_ID/spring-app:latest']
      - name: 'gcr.io/cloud-builders/docker'
        args: ['build', '-t', 'gcr.io/$PROJECT_ID/react-app:latest', '-f', 'react-app/Dockerfile', '.']
      - name: 'gcr.io/cloud-builders/docker'
        args: ['push', 'gcr.io/$PROJECT_ID/react-app:latest']
      - name: 'gcr.io/cloud-builders/kubectl'
        args: ['apply', '-f', 'k8s/spring-app-deployment.yaml']
        env:
          - 'CLOUDSDK_COMPUTE_ZONE=us-central1-a'
      - name: 'gcr.io/cloud-builders/kubectl'
        args: ['apply', '-f', 'k8s/react-app-deployment.yaml']
        env:
          - 'CLOUDSDK_COMPUTE_ZONE=us-central1-a'
    ```

2. **Trigger Cloud Build**:
    - Push the `cloudbuild.yaml` file to your GitHub repository.
    - Set up a trigger in Google Cloud Build to automatically build and deploy the applications when changes are pushed to the repository.

### Summary

By following these steps, you can deploy your Spring Boot and React applications to Google Cloud using Kubernetes and set up a CI/CD pipeline to automate the deployment process. Additionally, the debugging steps help ensure that the applications are accessible and functioning correctly.
