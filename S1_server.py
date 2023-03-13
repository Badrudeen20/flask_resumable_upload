# (A) INIT
# (A1) LOAD MODULES
from flask import Flask, render_template, jsonify,request, abort
import os

# (A2) FLASK SETTINGS
app = Flask(__name__)
HOST_NAME = "localhost"
HOST_PORT = 8000
# app.debug = True

# (A3) UPLOAD FOLDERS & FLAGS
UPLOAD_TEMP = os.path.dirname(os.path.realpath(__file__)) + "/temp"
UPLOAD_TO = os.path.dirname(os.path.realpath(__file__)) + "/upload"
UPLOAD_LOCK = {}

# (A4) CREATE UPLOAD FOLDERS IF NOT EXIST
if not os.path.isdir(UPLOAD_TEMP):
  os.mkdir(temp_dir, 0o777)
if not os.path.isdir(UPLOAD_TO):
  os.mkdir(temp_dir, 0o777)

# (A5) SUPPORT FUNCTION - GET RESUMABLE CHUNK DATA
def chunker(r):
  return {
    # "chunkNumber": int(r.get("resumableChunkNumber")),
    # "chunkSize": r.get("resumableChunkSize"),
    # "totalChunks": int(r.get("resumableTotalChunks")),
    # "identifier": r.get("resumableIdentifier"),
    # "path": r.get("resumableRelativePath"),
    # "fileName": r.get("resumableFilename"),
    # "fileSize": r.get("resumableTotalSize"),
    "tempPath": os.path.join(UPLOAD_TEMP),
    # "tempChunk": r.get("resumableChunkNumber")+".txt"

    #"tempPath": os.path.join(UPLOAD_TEMP, r.get("resumableIdentifier")),
    #"tempChunk": os.path.join(UPLOAD_TEMP, r.get("resumableIdentifier"), r.get("resumableChunkNumber") + ".part")
    
    
    
    

    "totalChunks": r.get("totalchunk"),
    # "fileName": r.get("filename"),
    "chunkNumber": r.get("chunk"),
    "tempChunk": r.get("chunk")+".txt"
  }

# (B) HTML UPLOAD PAGE
@app.route("/")
def index():
  return render_template("upload.html")
  #return render_template("S2_upload.html")

# (C) CHECK FILE/CHUNK
# @app.route("/uploads", methods=["GET"])
# def checker():
#   current = chunker(request.args)
#   if os.path.isfile(current["tempChunk"]):
#     return ("", 200)
#   else:
#     return ("", 404)

# (D) HANDLE FILE CHUNK UPLOAD
@app.route("/uploads", methods=["POST"])
def uploader():
  current = chunker(request.args)
  #print(current['tempChunk'])
  upload =  os.path.join(UPLOAD_TEMP,current["tempChunk"])
  request.files['file'].save(upload)
  with open(os.path.join(UPLOAD_TO, 'badru.mp4'), "ab") as fullfile:
    chunkName = os.path.join(current["tempPath"],str(current['chunkNumber'])+".txt")
    chunkFile = open(chunkName, "rb")
    fullfile.write(chunkFile.read())
    chunkFile.close()
    os.unlink(chunkName)
  fullfile.close()  
  # print(request.form.get('file'))
  # result =  {"bytes":[1,2,3]}
  # return jsonify(result)
  # jsonData = request.get_json()

  # (D1) GET CURRENT CHUNK INFORMATION
  # current = chunker(request.args)
  # return ("", 200)
  # (D2) CREATE TEMP FOLDER IF NOT ALREADY CREATED
  # if not os.path.isdir(current["tempPath"]):
  #   os.mkdir(current["tempPath"], 0o777)
  
  # print(current["tempChunk"])
  # (D3) SAVE CHUNK
  # upload =  os.path.join(UPLOAD_TEMP,current["tempChunk"])
  # request.files["file"].save(upload)
  # with open(os.path.join(UPLOAD_TO, current["fileName"]), "ab") as fullfile:
  #   chunkName = os.path.join(current["tempPath"],str(current['chunkNumber'])+".txt")
  #   chunkFile = open(chunkName, "rb")
  #   fullfile.write(chunkFile.read())
  #   chunkFile.close()
  #   os.unlink(chunkName)
  # (D4) ALL CHUNKS UPLOADED?
  complete = True
  for i in range(1, int(current["totalChunks"])):
    if not os.path.exists(os.path.join(current["tempPath"], str(i) + ".txt")):
      complete = False
      break
 
      
      # with open(os.path.join(UPLOAD_TO, current["fileName"]), "ab") as fullfile:
        
      #   for i in range(1, ):
      #     chunkName = os.path.join(current["tempPath"],str(i)+".txt")
      #     chunkFile = open(chunkName, "rb")
      #     fullfile.write(chunkFile.read())
      #     chunkFile.close()
      #   fullfile.close()
  # (D5) ON COMPLETION OF ALL CHUNKS
  # if complete and not current["identifier"] in UPLOAD_LOCK :
  #   # (D5-1) LOCK
  #   UPLOAD_LOCK[current["identifier"]] = 1

    # (D5-2) LET OUR POWERS COMBINE!
    # with open(os.path.join(UPLOAD_TO, current["fileName"]), "ab") as fullfile:
    #   for i in range(1, current["totalChunks"] + 1):
    #     chunkName = os.path.join(current["tempPath"],str(i)+".txt")
    #     chunkFile = open(chunkName, "rb")
    #     fullfile.write(chunkFile.read())
    #     chunkFile.close()
    #    # os.unlink(chunkName)
    #   fullfile.close()
     # os.rmdir(current["tempPath"])

    # (D5-3) UNLOCK
    # del UPLOAD_LOCK[current["identifier"]]

  # (D6) RESPONSE
  return ("", 200)






@app.route("/status", methods=["GET"])
def status():
    file_size =  request.headers.get('size')
    file_name =  request.headers.get('name')
    if os.path.exists(os.path.join(UPLOAD_TO, file_name)):
      check_size = os.path.getsize(UPLOAD_TO + "/"+file_name)
      if int(file_size)==check_size:
          result =  {"bytes":[{"check":int(check_size),"file":int(file_size)}]}
      else:
          result =  {"bytes":[{"check":int(check_size),"file":int(file_size)}]}
    else:
      result =  {"bytes":[{"check":0,"file":int(file_size)}]}
    
   
    return jsonify(result)
    # file_size = os.path.getsize(UPLOAD_TO + '/half.mp4')
    # print("File Size is :", file_size, "bytes")
    # return "bdr"

# (E) START!
if __name__ == "__main__":
  app.run(HOST_NAME, HOST_PORT)