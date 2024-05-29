import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AutoResizeDirective } from './directives/auto-resize.directive';  // Import the directive here

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    FileUploadComponent,
    AutoResizeDirective
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
