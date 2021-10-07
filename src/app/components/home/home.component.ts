import { Component, OnInit } from '@angular/core'
import { faAngry as faAngryReg } from '@fortawesome/free-regular-svg-icons'
import { faAngry, faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
    identity, iif, merge, OperatorFunction, Subscription
} from 'rxjs'
import { map, take, tap } from 'rxjs/operators'
import { MockServerService } from '../../services/mock-server.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

    // set the fa icon vars
    public faCoffee: IconDefinition = faCoffee
    public faAngry: IconDefinition = faAngry
    public faAngryReg: IconDefinition = faAngryReg

    // array of responses
    public serverResponses: number[]

    // initialized in onInit
    public serverSubscription!: Subscription

    // processing options
    public processingOptions: Record<string, boolean> = {
        merge: false,
        addOne: true,
    }

    // eslint-disable-next-line no-unused-vars
    constructor(private mockServer: MockServerService) {
        this.serverResponses = []
    }

    ngOnInit(): void {
        // subscribe to the server responses
    }

    //* PUBLIC METHODS *//

    sendOneRequest(): void {
        this.serverResponses = []
        console.log('\nsending one request')
        this.resubscribe()
        this.mockServer.singleRequest()
    }

    sendFiveRequests(): void {
        this.serverResponses = []
        console.log('\nsending five requests')
        this.resubscribe()
        this.mockServer.multiRequest(5)
    }

    //* PRIVATE METHODS */

    private resubscribe(): void {
        this.serverSubscription = this.mockServer.serverResponses.pipe(
            (this.processingOptions.addOne
                ? map((x) => x + 1)
                : identity)
        ).pipe(
            take(2),
            tap((x) => console.log(x))
        ).subscribe(
            (value: number) => {
                this.serverResponses.push(value)
            }
        )
    }
}
