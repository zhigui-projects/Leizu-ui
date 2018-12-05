# Copyright Zhigui.com. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0

DASHBOARD-IMAGE := $(shell docker images -q dashboard-ui:latest)

stop:
	@docker-compose stop
	@docker-compose rm -f

start:
	@npm run build
ifneq ($(strip $(DASHBOARD-IMAGE)),)
	@docker rmi $(DASHBOARD-IMAGE)
endif
	@docker-compose up -d --build

logs:
	@docker-compose logs -f --tail=200
