from flask import Flask, request, jsonify, make_response
from spacy.pipeline import EntityRecognizer
from flask_cors import CORS
import spacy
app = Flask(__name__)

cors = CORS()

nlp = spacy.load("en_core_web_sm")



print("Loaded")


@app.route("/tasks/NER", methods=["POST"])
def nerRoute():
    data = request.json["data"]
    print(data)

    out = []

    for file in data:
        text = file["file"]["text"]
        doc = nlp(text)
        out.append({"fileID": file["file"]["id"] ,"data": [{"text": ent.text, "type": ent.label_} for ent in doc.ents]})
    print(out)
    res = make_response(jsonify({"data": out}))
    res.headers["Content-Type"] = "application/json"

    return res







app.run("localhost","5000", debug=True)