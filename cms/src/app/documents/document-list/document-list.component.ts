import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'CIT112 - Introduction to Linux', 'This course describes the Linux operating system and exposes the student to the most common distributions of Linux. This course teaches the student how to login and explore before explaining the file system, manipulating files, and how to use the Linux Command Line Interface (CLI) or shell. The course also teaches the student how to work with archiving, compression, text processing, regular expressions, and shell scripting.', 'https://www.byui.edu/catalog#/courses/HyZ4-POw4?bc=true&bcCurrent=CIT112%20-%20Introduction%20to%20Linux&bcGroup=Computer%20Information%20Technology&bcItemType=courses', null),
    new Document('2', 'CIT241 - Network Design I', 'This course teaches the principles of network standards and architectures that correspond to the Interconnecting Cisco Networking Devices Part 2 (ICND2) standard. Students will learn the configuration and use of networking devices and protocols including LAN switching technologies, IPv4 and IPv6 routing technologies, WAN technologies, infrastructure services, and infrastructure maintenance.', 'https://www.byui.edu/catalog#/courses/4JzcTjghsZ?bc=true&bcCurrent=CIT241%20-%20Network%20Design%20I&bcGroup=Computer%20Information%20Technology&bcItemType=courses', null),
    new Document('3', 'CIT260 - Object Oriented Programming', 'This course is an introduction to object oriented programming using the Java programming language. Students will write computer programs using primitive data types, control structures, Java Swing classes, and objects. Students will read and draw UML class diagrams and will use Java swing to write programs with a graphical user interface.', 'https://www.byui.edu/catalog#/courses/NJsaox3sW?group=Computer%20Information%20Technology&bc=true&bcCurrent=Computer%20Information%20Technology&bcItemType=courses&bc=true&bcCurrent=CIT260%20-%20Object%20Oriented%20Programming&bcGroup=Computer%20Information%20Technology&bcItemType=courses', null),
    new Document('4', 'CIT345 - Wireless Networking', 'This is an introductory course in Wireless Networking. The course encompasses the design, planning implementation, operation, and troubleshooting of wireless communication.  The material covers a comprehensive overview of technologies, security, and design practices.', 'https://www.byui.edu/catalog#/courses/EkR6sl3oZ?group=Computer%20Information%20Technology&bc=true&bcCurrent=Computer%20Information%20Technology&bcItemType=courses&bc=true&bcCurrent=CIT345%20-%20Wireless%20Networking&bcGroup=Computer%20Information%20Technology&bcItemType=courses', null),
    new Document('5', 'CIT151 - Operating System Fundamentals', 'A comparative study of operating system fundamentals.  Covers basic operating system principles such as booting, processes, authentication, file systems, permissions, networking and security as implemented by *Nix and Windows based operating systems.', 'https://www.byui.edu/catalog#/courses/H1TUNDoSE?group=Computer%20Information%20Technology&bc=true&bcCurrent=Computer%20Information%20Technology&bcItemType=courses&bc=true&bcCurrent=CIT151%20-%20Operating%20System%20Fundamentals&bcGroup=Computer%20Information%20Technology&bcItemType=courses', null)
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
