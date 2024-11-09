.PHONY: remove-modules web-dev api-dev

remove-modules:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' + & 	find . -name "pnpm-lock.yaml" -exec rm -rf '{}' +

api-dev:
	pnpm -F @my-app/api dev

web-dev:
	pnpm -F @my-app/web dev


