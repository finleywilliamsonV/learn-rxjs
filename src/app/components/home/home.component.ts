import { BehaviorSubject, combineLatest, Subscription } from 'rxjs'
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core'
import { faAngry as faAngryReg } from '@fortawesome/free-regular-svg-icons'
import { faAngry, faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

    // set the fa icon vars
    public faCoffee: IconDefinition = faCoffee
    public faAngry: IconDefinition = faAngry
    public faAngryReg: IconDefinition = faAngryReg
}
