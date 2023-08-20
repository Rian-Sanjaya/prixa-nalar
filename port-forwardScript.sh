if [ "$1" == "covid" ]; then
  pkill -9 -f "kubectl port-forward"
  echo "Running Covid19 PortForward ..."
  sleep 1
  echo 'execute consul\r'
  kubectl port-forward svc/consul-consul-ui 8500:80 -n consul &
  echo 'execute elasticsearch\r'
  kubectl port-forward svc/meili-meilisearch 7700:9200 -n prixa-covid19 &
  sleep 1
  echo 'execute rabbitmq\r'
  echo "Processing covid ..."
  kubectl port-forward svc/rabbitmq 5672:5672 -n rabbitmq
  echo '\n'
elif [ "$1" == "nalar:dev" ]; then
  pkill -9 -f "kubectl port-forward"
  echo "Running Nalar with Server Dev PortForward ..."
  sleep 1
  echo "Processing prixa-db dev server ..."
  kubectl port-forward svc/prixa-db-diagnostic-backend-internal 8001:80 -n prixa
  echo '\n'
elif [ "$1" == "covid:dev" ]; then
  pkill -9 -f "kubectl port-forward"
  echo "Running Covid19 with Server Dev PortForward ..."
  sleep 1
  echo "Processing prixa-db covid19 dev server ..."
  kubectl port-forward svc/prixa-db-diagnostic-backend-internal 8001:80 -n prixa-covid19 
  echo '\n'
elif [ "$1" == "stop" ]; then
  pkill -9 -f "kubectl port-forward"
  echo "all kubectl port-forward stoped."
else
  pkill -9 -f "kubectl port-forward"
  echo "Running Nalar PortForward ..."
  sleep 1
  echo 'execute consul\r'
  kubectl port-forward svc/consul-consul-ui 8500:80 -n consul &
  echo 'execute meili\r'
  kubectl port-forward svc/meili-meilisearch 7700:9200 -n meilisearch &
  sleep 1
  echo 'execute rabbitmq\r'
  echo "Processing nalar ..."
  kubectl port-forward svc/rabbitmq 5672:5672 -n rabbitmq
  echo '\n'
fi