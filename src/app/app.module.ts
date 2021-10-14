import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { ServerRequestPanelComponent } from './components/server-request-panel/server-request-panel.component'
import { WordFilterPanelComponent } from './components/word-filter-panel/word-filter-panel.component'

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ServerRequestPanelComponent,
        WordFilterPanelComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
