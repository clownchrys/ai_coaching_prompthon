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
	python${PYTHON_VERSION} -m pip install -r ${BE}/requirements.txt
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
	&& pip install -r requirements.txt \
	&& python main.py

.PHONY: serve
serve:
	cd ${BE} \
	&& source ${PYTHON_VENV}/bin/activate \
	&& pf flow serve --source flows/ai_coaching/ai-coaching-flow --port 8080
# && pf flow serve --source ${BE}/flows/ai_interview --port 8081 \
# && pf flow serve --source ${BE}/flows/ai_interview_fb --port 8082 \
# && pf flow serve --source ${BE}/flows/co_bing_search --port 8083 \
# && pf flow serve --source ${BE}/flows/naver_book_search --port 8084