#!/usr/bin/env bash
set -euo pipefail

COMPOSE=(docker compose)

INFRA_SERVICES=(
  zookeeper
  kafka
  redis
  mongodb
)

BACKEND_SERVICES=(
  mta-gateway
  mta-auth
  mta-users
  mta-tweets
)

OBSERVABILITY_SERVICES=(
  prometheus
  tempo
  loki
  promtail
  grafana
  redis-exporter
  kafka-exporter
)

SUPPORT_SERVICES=(
  kafka-ui
  redis-commander
  nginx-gateway
)

usage() {
  cat <<'USAGE'
Usage: scripts/compose.sh <command>

Commands:
  up:infra        Start Kafka, Redis, MongoDB, and dependencies
  up:backend      Start backend app services
  up:obs          Start observability stack and exporter dependencies
  up:support      Start support UIs and nginx gateway
  up:all          Start every compose service
  stop            Stop running containers without removing them
  stop:backend    Stop backend app services
  stop:obs        Stop observability stack
  down            Stop and remove containers/networks
  restart:obs     Restart observability stack
  logs:obs        Follow observability logs
  ps              Show compose service status
  config          Validate compose configuration
USAGE
}

case "${1:-}" in
  up:infra)
    "${COMPOSE[@]}" up -d "${INFRA_SERVICES[@]}"
    ;;
  up:backend)
    "${COMPOSE[@]}" up -d "${BACKEND_SERVICES[@]}"
    ;;
  up:obs)
    "${COMPOSE[@]}" up -d "${OBSERVABILITY_SERVICES[@]}"
    ;;
  up:support)
    "${COMPOSE[@]}" up -d "${SUPPORT_SERVICES[@]}"
    ;;
  up:all)
    "${COMPOSE[@]}" up -d
    ;;
  stop)
    "${COMPOSE[@]}" stop
    ;;
  stop:backend)
    "${COMPOSE[@]}" stop "${BACKEND_SERVICES[@]}"
    ;;
  stop:obs)
    "${COMPOSE[@]}" stop "${OBSERVABILITY_SERVICES[@]}"
    ;;
  down)
    "${COMPOSE[@]}" down
    ;;
  restart:obs)
    "${COMPOSE[@]}" up -d --force-recreate "${OBSERVABILITY_SERVICES[@]}"
    ;;
  logs:obs)
    "${COMPOSE[@]}" logs -f "${OBSERVABILITY_SERVICES[@]}"
    ;;
  ps)
    "${COMPOSE[@]}" ps
    ;;
  config)
    "${COMPOSE[@]}" config --quiet
    ;;
  "" | -h | --help | help)
    usage
    ;;
  *)
    echo "Unknown command: $1" >&2
    usage >&2
    exit 1
    ;;
esac
