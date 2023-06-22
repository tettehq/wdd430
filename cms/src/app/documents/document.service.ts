import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
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

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();

  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<Document[]>('https://wdd430-project1-default-rtdb.firebaseio.com/documents.json').subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.documentListChangedEvent.next(this.documents.slice());
        console.log(typeof(this.documents));
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
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    const documentsList = this.documents.slice();
    this.documentListChangedEvent.next(this.storeDocuments());
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
  if (newDocument === undefined || newDocument === null) {
    // console.log('Stuck here!');
    return
  }
  this.maxDocumentId++;
  // console.log(this.maxDocumentId);
  newDocument.id = `${this.maxDocumentId}`;
  this.documents.push(newDocument);
  const documentsList = this.documents.slice();
  this.documentListChangedEvent.next(this.storeDocuments());
 }

 updateDocument(originalDocument: Document, newDocument: Document) {
  if (originalDocument === undefined || newDocument === undefined) {
    return
  }

  const pos = this.documents.indexOf(originalDocument);
  if (pos < 0) {
    return
  }

  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  const documentsList = this.documents.slice();
  this.documentListChangedEvent.next(this.storeDocuments());
 }

 storeDocuments() {
  const data = JSON.stringify(this.documents);
  return this.http.put(
    'https://wdd430-project1-default-rtdb.firebaseio.com/documents.json',
    data,
    {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      }
    )
 }
}
