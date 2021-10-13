import { Component, OnInit } from '@angular/core'
import { faAngry as faAngryReg } from '@fortawesome/free-regular-svg-icons'
import { faAngry, faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
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
    public serverResponses: {
        responseNumber: number,
        responseValue: number,
    }[]

    // options for processing server responses
    public readonly processingOptions = {
        addOne: false,
        filterOdds: false,
    }

    // initialized in onInit
    public serverSubscription!: Subscription

    // Words for words filter panel
    public wordsToFilter: string[]

    // count of response from the server
    private responseCount: number

    /**
     * Constructor function
     * @param mockServer
     */
    // eslint-disable-next-line no-unused-vars
    constructor(private mockServer: MockServerService) {
        this.serverResponses = []
        this.responseCount = 0
        this.wordsToFilter = [
            'calendar',
            'provincial',
            'prospect',
            'announce',
            'exotic',
            'fitness',
            'recognise',
            'leadership',
            'originate'
        ]
    }

    ngOnInit(): void {

        // subscribe to the server responses
        this.mockServer.serverResponses.pipe(
            tap(
                () => this.responseCount++
            ),
            map(
                (value: number) => (this.processingOptions.addOne ? value + 1 : value)
            ),
            filter(
                (value: number) => (this.processingOptions.filterOdds ? value % 2 === 1 : true)
            )
        ).subscribe(
            (finalValue: number) => {
                this.serverResponses.push({
                    responseNumber: this.responseCount,
                    responseValue: finalValue,
                })
            }
        )
    }

    //* PUBLIC METHODS *//

    /**
     * Sends a single request to the server
     */
    sendOneRequest(): void {
        this.mockServer.singleRequest()
    }

    /**
     * Sends 5 requests to the server
     */
    sendFiveRequests(): void {
        this.mockServer.multiRequest(5)
    }

    /**
     * Clears the response array and resets the server
     */
    resetServer(): void {
        this.serverResponses = []
        this.responseCount = 0
        this.mockServer.resetServer()
    }

    //* PRIVATE METHODS */
}
