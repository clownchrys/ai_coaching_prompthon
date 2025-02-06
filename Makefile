PYTHON_VENV = ./server/.venv

# .PHONY: create-next-app
# create-next-app:	
# 	create-next-app web -ts --src-dir --app --eslint

.PHONY: init
init:
	brew install npm
	brew install python@3.11
	python3.11 -m venv ${PYTHON_VENV}

.PHONY: web
web:
	cd web && npm install && npm run dev

.PHONY: server
server:
	source ${PYTHON_VENV}/bin/activate
