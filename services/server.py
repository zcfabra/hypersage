from flask import Flask, request, jsonify, make_response
from spacy.pipeline import EntityRecognizer
from spacytextblob.spacytextblob import SpacyTextBlob
from flask_cors import CORS
import spacy
import time
app = Flask(__name__)

cors = CORS()

nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("spacytextblob")



print("Loaded")


@app.route("/tasks/NER", methods=["POST"])
def nerRoute():
    data = request.json["data"]
    print(data)

    out = {}

    for file in data:
        text = file["file"]["text"]
        doc = nlp(text)
        out[file["file"]["id"]] = {"data": [{"text": ent.text, "label": ent.label_} for ent in doc.ents]}
    print(out)
    res = make_response(jsonify(out))
    res.headers["Content-Type"] = "application/json"
    # time.sleep(10)
    return res

@app.route("/tasks/Sentiment", methods=["POST"])
def sentimentRoute():
    files = request.json["data"]
    print("FILES", files)
    ids = [file["fileID"] for file in files]
    docs = [nlp(file["file"]["text"]) for file in files]

    out = {}
    for ix, doc in enumerate(docs):
        out[ids[ix]] = {
            "score": (sent_score:=doc._.blob.polarity),
            "sentiment": "POS" if sent_score > 0.0 else "NEG",
            "pos_words": [each[0][0] for each in doc._.blob.sentiment_assessments.assessments if each[1] > 0],
            "neg_words": [each[0][0] for each in doc._.blob.sentiment_assessments.assessments if each[1] < 0]
            }
    res = make_response(jsonify(out))
    res.headers["Content-Type"] = "application/json"
    print(res)
    return res

@app.route("/tasks/Similarity", methods=["POST"])
def similarityRoute():
    files = request.json["data"]
    print("FILES",files)
    ids = [file["fileID"] for file in files]
    docs = [nlp(file["file"]["text"]) for file in files]


    out = {}
    for ix, doc in enumerate(docs):
        similarities = {}

        for idx, other_doc in enumerate(docs):
            if other_doc == doc:
                continue
            if other_doc in out:
                similarities[ids[idx]] = out[ids[idx]][ids[ix]]
            
            else:
                similarities[ids[idx]] = doc.similarity(other_doc)

        out[ids[ix]] = similarities
    print(out)
    res = make_response(jsonify(out))
    res.headers["Content-Type"] = "application/json"
    return res


        







app.run("localhost","5000", debug=True)