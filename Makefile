FE = web
BE = server

PYTHON_VENV = .venv
PYTHON_VERSION = 3.9

# .PHONY: create-next-app
# create-next-app:	
# 	create-next-app web -ts

.PHONY: init
init:
	brew install npm
	brew install python@${PYTHON_VERSION}
	python${PYTHON_VERSION} -m venv ${BE}/${PYTHON_VENV}

.PHONY: fe
fe:
	cd ${FE} \
	&& npm install \
	&& npm run dev

.PHONY: be
be:
	cd ${BE} \
	&& source ${PYTHON_VENV}/bin/activate \
	&& python main.py

