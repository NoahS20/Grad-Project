import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AutoResizeDirective } from './directives/auto-resize.directive';  // Import the directive here
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [ApiService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule { }
