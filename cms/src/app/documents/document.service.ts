import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentChangedEvent = new EventEmitter<Document[]>();

  documentSelectedEvent = new EventEmitter<Document>();

  documentListChangedEvent = new Subject<any>();

  maxDocumentId: number;

  localUrl: string = 'http://localhost:3000/documents/';

  firebaseUrl: string = 'https://wdd430-project1-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();

  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<{message: string, documents: Document[]}>(this.localUrl).subscribe(
      (response: {message: string, documents: Document[]}) => {
        this.documents = response.documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.documentListChangedEvent.next(this.documents.slice());
        console.log(this.documents);
      },
      (error: any) => {
        console.log('An error occurred '+ error);
      }
    )
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].id == id) {
        return this.documents[i]
      }
    }
    return null
  }

  deleteDocument(document: Document) {
    // if (!document) {
    //    return;
    // }
    // const pos = this.documents.indexOf(document);
    // if (pos < 0) {
    //    return;
    // }
    // this.documents.splice(pos, 1);
    // const documentsList = this.documents.slice();
    // this.documentListChangedEvent.next(documentsList);

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.localUrl + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
 }

 getMaxId(): number {
  let maxId = 0;
  this.documents.forEach(
    (document: Document) => {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId
      }
    }
  )
  return maxId;
 }

 addDocument(newDocument: Document) {
  // if (newDocument === undefined || newDocument === null)
  //   return
  // }
  // this.maxDocumentId++;
  // newDocument.id = `${this.maxDocumentId}`;
  // this.documents.push(newDocument);
  // const documentsList = this.documents.slice();
  // this.documentListChangedEvent.next(this.storeDocuments());

  if (!newDocument) {
    return;
  }

  // make sure id of the new Document is empty
  newDocument.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, document: Document }>(this.localUrl,
    newDocument,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend()
      }
    );
 }

 updateDocument(originalDocument: Document, newDocument: Document) {
  // if (originalDocument === undefined || newDocument === undefined) {
  //   return
  // }

  // const pos = this.documents.indexOf(originalDocument);
  // if (pos < 0) {
  //   return
  // }

  // newDocument.id = originalDocument.id;
  // this.documents[pos] = newDocument;
  // const documentsList = this.documents.slice();

  if (!originalDocument || !newDocument) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === originalDocument.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newDocument.id = originalDocument.id;
  newDocument._id = originalDocument._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put(this.localUrl + originalDocument.id,
    newDocument, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend()
      }
    );
 }

 sortAndSend() {
  if (Array.isArray(this.documents)) {
    this.documents.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }
}

//  storeDocuments() {
//   const data = JSON.stringify(this.documents);
//   return this.http.put(
//     this.localUrl,
//     data,
//     {
//       headers: new HttpHeaders({'Content-Type': 'application/json'})
//     }).subscribe(
//       () => {
//         this.documentListChangedEvent.next(this.documents.slice());
//       }
//     )
//  }
}
