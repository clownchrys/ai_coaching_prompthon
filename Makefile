PYTHON_VENV = ./server/.venv
PYTHON_VERSION = 3.9

# .PHONY: create-next-app
# create-next-app:	
# 	create-next-app web -ts --src-dir --app --eslint

.PHONY: init
init:
	brew install npm
	brew install python@${PYTHON_VERSION}
	python${PYTHON_VERSION} -m venv ${PYTHON_VENV}

.PHONY: web
web:
	cd web && npm install && npm run dev

.PHONY: server
server:
	source ${PYTHON_VENV}/bin/activate
