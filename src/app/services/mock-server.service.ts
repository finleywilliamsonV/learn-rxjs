import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class MockServerService {

    /**
     * count of responses sent
     */
    private responseCount: number = 0

    /**
     * subject emitting server responses
     */
    readonly serverResponses: Subject<number>

    /**
     * Constructor
     */
    constructor() {
        this.serverResponses = new Subject<number>()
    }

    // *---------------------------------------------*
    // *------------- Public Methods ----------------*
    // *---------------------------------------------*

    /**
     * Requests a single response from the server
     * @param delay the time until the response is returned
     */
    singleRequest(delay: number = 100): void {
        setTimeout(() => {
            this.sendResponse()
        }, delay)
    }

    /**
     * Requests multiple reponses from the server
     * @param numberOfRequests number of requests to make
     * @param delay delay between each request
     */
    multiRequest(numberOfRequests: number, delay: number = 100): void {
        let requestsRemaining: number = numberOfRequests
        const intervalId = setInterval(() => {
            if (requestsRemaining-- > 0) {
                this.sendResponse()
            } else {
                clearInterval(intervalId)
            }
        }, delay)
    }

    /**
     * Resets the response count to 0
     */
    resetServer() {
        this.responseCount = 0
    }

    // *---------------------------------------------*
    // *------------- Private Methods ---------------*
    // *---------------------------------------------*

    /**
     * Pushes a response onto the response subject
     * @param responseText additional response text
     */
    private sendResponse(): void {
        this.serverResponses.next(++this.responseCount)
    }
}
