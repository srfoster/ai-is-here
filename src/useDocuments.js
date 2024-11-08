
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import {useLocalStorage} from 'react-use'

export let useDocs = () => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")

  let [documents, setDocuments] = React.useState([])

  React.useEffect(() => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "list" }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log("Documents", data)
        setDocuments(JSON.parse(data.body).documents)
      })


  },[]);

  let createDocument = (document) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "create", ...document }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let documentId = JSON.parse(data.body).documentId
        setDocuments([...documents, { ...document, documentId}])
      })
  }

  let deleteDocument = (documentId) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "delete", documentId }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDocuments(documents.filter((d) => d.documentId !== documentId))
      })
  }

  let updateDocument = (document) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "update", ...document }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDocuments(documents.map((d) => {
          if (d.documentId === document.documentId) {
            return document
          } else {
            return d
          }
        }))
      })
  }

  return [documents, createDocument, deleteDocument, updateDocument]
}

export let useDoc = (documentId) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")
  let [doc, setDoc] = React.useState()

  React.useEffect(() => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "read", documentId: documentId }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let doc = JSON.parse(data.body)
        doc.documentId = documentId
        setDoc(doc)
      })
  },[]);
    
  let updateDoc = (title, content) => {
    console.log("Updating doc", doc, title, content)
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "update", documentId, title, content }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDoc(document)
      })
  }

  let deleteDoc = (afterDelete) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "delete", documentId }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDoc(undefined)
        afterDelete && afterDelete()
      })
  } 

  return [doc, updateDoc, deleteDoc]
}