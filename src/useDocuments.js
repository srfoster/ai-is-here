
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import {useLocalStorage} from 'react-use'
import { CreditStringContext, useCheckCredits } from './useGpt';

export let useChildKeys = () => {
  const {creditString,setCreditString,remainingCredits, refreshCredits } = React.useContext(CreditStringContext);

  let [keys, setKeys] = React.useState([])

  React.useEffect(() => {
    if(!creditString) {
      return
    }
    fetch(gptProxyData.child_management, { method: "POST", body: JSON.stringify({ parentKey: creditString, operation: "list" }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if(data.statusCode === 200){
          setKeys(JSON.parse(data.body))
        }
      })
  },[creditString]);

  let createKey = (metadata = {}) => {
    fetch(gptProxyData.child_management, { method: "POST", body: JSON.stringify({ parentKey: creditString, operation: "create", metadata: metadata}) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if(data.statusCode === 200)
          setKeys((keys)=>[{...JSON.parse(data.body), createdAt: new Date(), justCreated: true}, ...keys])
      })
  }

  let deleteKey = (key) => {
    fetch(gptProxyData.child_management, { method: "POST", body: JSON.stringify({ parentKey: creditString, operation: "delete", childKey: key }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setKeys(keys.map((k) => k.childKey !== key ? k : {...k, justDeleted: true}))
      })
  }

  let transferCreditsToKey = async (key, amount) => {
    let response = await fetch(gptProxyData.child_management, { method: "POST", body: JSON.stringify({ parentKey: creditString, operation: "transfer", childKey: key, amount: amount }) })

    let data = await response.json()

    if(data.statusCode === 200) {
      setKeys((keys) => keys.map((k)=>{
        if(k.childKey === key) {
          return {...k, remainingCredits: k.remainingCredits + amount}
        }
        return k
      }))
      refreshCredits()
    }
  }

  let sendInvite = async (key) => {
    let response = await fetch(gptProxyData.child_management, { method: "POST", body: JSON.stringify({ operation: "invite", childKey: key }) })

    let data = await response.json()

    if(data.statusCode === 200) {
      setKeys((keys) => keys.map((k)=>{
        if(k.childKey === key) {
          return {...k, inviteSent: true}
        }
        return k
      }))
    }
  }

  return [keys, createKey, deleteKey, transferCreditsToKey, sendInvite]
}

export let useDocs = () => {
  const {creditString,setCreditString} = React.useContext(CreditStringContext);

  let [documents, setDocuments] = React.useState([])

  React.useEffect(() => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "list" }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log("Documents", data)
        setDocuments(JSON.parse(data.body).documents)
      })


  },[]);

  let createDocument = (document) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "create", ...document }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let documentId = JSON.parse(data.body).documentId
        setDocuments([...documents, { ...document, documentId}])
      })
  }

  let deleteDocument = (documentId) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "delete", documentId }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDocuments(documents.filter((d) => d.documentId !== documentId))
      })
  }

  let updateDocument = (document) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "update", ...document }) })
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
  const {creditString,setCreditString} = React.useContext(CreditStringContext);
  let [doc, setDoc] = React.useState()

  React.useEffect(() => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "read", documentId: documentId }) })
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
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "update", documentId, title, content }) })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setDoc(document)
      })
  }

  let deleteDoc = (afterDelete) => {
    fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "delete", documentId }) })
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