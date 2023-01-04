SRC := ./extension
DIST := ./dist
ZIP := $(shell which zip)

PACKAGE_NAME := graphite-pr-switcher
PACKAGE_VERSION := $(shell jq -r '.version' < ./extension/manifest.json)

build:
	rm -rf $(DIST); \
	mkdir -p $(DIST); \
	cd $(SRC); \
	find . -type f -print | $(ZIP) ../$(DIST)/$(PACKAGE_NAME)-$(PACKAGE_VERSION).zip -@
