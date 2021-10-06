import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class MockServerService {
    /**
     * count of responses sent
     */
    protected responseCount: number = 0

    /**
     * subject emitting server responses
     */
    readonly serverResponseSub: Subject<string>

    /**
     * Constructor
     */
    constructor() {
        this.serverResponseSub = new Subject<string>()
    }

    // *---------------------------------------------*
    // *------------- Public Methods ----------------*
    // *---------------------------------------------*

    /**
     * Requests a single response from the server
     * @param delay the time until the response is returned
     */
    singleRequest(delay: number): void {
        setTimeout(() => {
            this.sendResponse()
        }, delay)
    }

    /**
     * Requests multiple reponses from the server
     * @param numberOfRequests number of requests to make
     * @param delay delay between each request
     */
    multiRequest(numberOfRequests: number, delay: number): void {
        const requestsRemaining: number = numberOfRequests
        const intervalId: NodeJS.Timeout = setInterval(() => {
            if (requestsRemaining > 0) {
                this.sendResponse()
            } else {
                clearInterval(intervalId)
            }
        }, delay)
    }

    // *---------------------------------------------*
    // *------------- Private Methods ---------------*
    // *---------------------------------------------*

    /**
     * Pushes a response onto the response subject
     * @param responseText additional response text
     */
    private sendResponse(responseText?: string): void {
        this.serverResponseSub.next(`Server Response ${++this.responseCount}${responseText && `: ${responseText}`}`)
    }
}