
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import {useLocalStorage} from 'react-use'

export let useDocuments = () => {
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
    

  return [documents, setDocuments]
}

export let useDocument = (documentId) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")
  let [doc, setDoc] = React.useState()

  React.useEffect(() => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: currentCreditString, operation: "read", documentId: documentId }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDoc(JSON.parse(data.body))
      })
  },[]);
    

  return [doc, setDoc]
}