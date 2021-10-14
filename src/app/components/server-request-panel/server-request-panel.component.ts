import { Component, OnInit } from '@angular/core'
import { filter, map, tap } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { MockServerService } from '../../services/mock-server.service'

@Component({
    selector: 'server-request-panel',
    templateUrl: './server-request-panel.component.html',
    styleUrls: ['./server-request-panel.component.scss'],
})
export class ServerRequestPanelComponent implements OnInit {

    // array of responses
    public serverResponses: {
        responseNumber: number,
        responseValue: number,
    }[]

    // options for processing server responses
    public readonly processingOptions = {
        addThree: false,
        filterOdds: false,
    }

    // count of response from the server
    private responseCount: number

    // eslint-disable-next-line no-unused-vars
    constructor(private mockServer: MockServerService) {
        this.serverResponses = []
        this.responseCount = 0
    }

    ngOnInit(): void {
        this.setupServerPanel()
    }

    //* ------------------------- PUBLIC SERVER METHODS ------------------------- *//

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

    //* ------------------------- PRIVATE METHODS ------------------------- *//

    /**
     * Sets up the pipe and subscription to the mock server service
     * @returns Subscription to the mock server service
     */
    private setupServerPanel(): Subscription {
        // subscribe to the server responses
        return this.mockServer.serverResponses.pipe(
            tap(
                () => this.responseCount++
            ),
            map(
                (value: number) => (this.processingOptions.addThree ? value + 3 : value)
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
}
