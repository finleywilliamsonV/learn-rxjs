/* eslint-disable class-methods-use-this */
import { Component, OnInit } from '@angular/core'
import { faAngry as faAngryReg } from '@fortawesome/free-regular-svg-icons'
import { faAngry, faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs'
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

    // Words for words filter panel
    public wordsToFilter: {
        word: string,
        visibility: boolean
    }[]

    // count of response from the server
    private responseCount: number

    // word filter observables
    private readonly wordsWithSubject$: BehaviorSubject<string | null>
    private readonly wordsWithoutSubject$: BehaviorSubject<string | null>

    /**
     * Constructor function
     * @param mockServer
     */
    // eslint-disable-next-line no-unused-vars
    constructor(private mockServer: MockServerService) {

        // initialize server vars
        this.serverResponses = []
        this.responseCount = 0

        // initialize word filter vars
        this.wordsWithSubject$ = new BehaviorSubject<string | null>(null)
        this.wordsWithoutSubject$ = new BehaviorSubject<string | null>(null)
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
        ].map((word: string) => ({
            word,
            visibility: true,
        }))
    }

    ngOnInit(): void {
        this.setupServerPanel()
        this.setupWordFilterPanel()
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

    //* ------------------------- PUBLIC WORD FILTER METHODS ------------------------- *//

    onWordsWithChange($event: Event): void {
        const target: HTMLInputElement = $event.target as HTMLInputElement
        this.wordsWithSubject$.next(target.value)
    }

    onWordsWithoutChange($event: Event): void {
        const target: HTMLInputElement = $event.target as HTMLInputElement
        this.wordsWithoutSubject$.next(target.value)
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

    /**
     * Sets up the pipe and subscription to the word filter observables
     * @returns Subscription to the mock server service
     */
    private setupWordFilterPanel(): Subscription {
        return combineLatest([
            this.wordsWithSubject$,
            this.wordsWithoutSubject$
        ]).subscribe(
            ([
                filterWordsWith,
                filterWordsWithout
            ]: (string | null)[]) => {

                // RegExp = new RegExp('')

                this.wordsToFilter = this.wordsToFilter.map(
                    (wordData) => ({
                        word: wordData.word,
                        visibility: /[asdf]/.test(wordData.word),
                    })
                )
            }
        )
    }

    // private wordContainsLetters(word: string, letters: string): boolean {

    // }
}
