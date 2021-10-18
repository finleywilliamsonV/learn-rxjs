import {
    Component, ElementRef, OnInit, ViewChild
} from '@angular/core'
import {
    BehaviorSubject, combineLatest, Subject, Subscription
} from 'rxjs'
import { finalize, skipUntil, takeUntil } from 'rxjs/operators'
import { faSyncAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { RandomWordsService } from '../../services/random-words.service'

@Component({
    selector: 'word-filter-panel',
    templateUrl: './word-filter-panel.component.html',
    styleUrls: ['./word-filter-panel.component.scss'],
})
export class WordFilterPanelComponent implements OnInit {

    // font awesome refresh icon
    public faSyncAlt: IconDefinition = faSyncAlt
    public iconData: {
        isHovering: boolean,
        isProcessing: boolean
    }

    // Words for words filter panel
    public wordsToFilter!: {
        word: string,
        visibility: boolean
    }[]

    // word filter observables
    private readonly refreshWordList$: Subject<'refresh'>
    private readonly wordsFetched$: Subject<'fetched'>
    private readonly wordsWithFilterSubject$: BehaviorSubject<string | null>
    private readonly wordsWithoutFilterSubject$: BehaviorSubject<string | null>

    // view children
    @ViewChild('wordsWithInput')
    private wordsWithInput!: ElementRef<HTMLInputElement>

    @ViewChild('wordsWithoutInput')
    private wordsWithoutInput!: ElementRef<HTMLInputElement>

    /**
     * Constructor
     * @param randomWordsService
     */
    // eslint-disable-next-line no-unused-vars
    constructor(private randomWordsService: RandomWordsService) {

        // initialize icon hover
        this.iconData = {
            isHovering: false,
            isProcessing: false,
        }

        // initialize word filter vars
        this.refreshWordList$ = new Subject<'refresh'>()
        this.wordsFetched$ = new Subject<'fetched'>()
        this.wordsWithFilterSubject$ = new BehaviorSubject<string | null>(null)
        this.wordsWithoutFilterSubject$ = new BehaviorSubject<string | null>(null)

        // fetch the word list from the server
        console.log('initialize from constructor')
        this.initializeWordList()

    }

    /**
     * On Init Hook
     */
    ngOnInit(): void {
        this.setupWordFilterPanel()
    }

    //* ------------------------- PUBLIC WORD FILTER METHODS ------------------------- *//

    /**
     * Pushes the next string to the observable
     * @param $event
     */
    onWordsWithChange($event: Event): void {
        const target: HTMLInputElement = $event.target as HTMLInputElement
        // push null if string is empty
        this.wordsWithFilterSubject$.next(target.value || null)
    }

    /**
     * Pushes the next string to the observable
     * @param $event
     */
    onWordsWithoutChange($event: Event): void {
        const target: HTMLInputElement = $event.target as HTMLInputElement
        // push null if string is empty
        this.wordsWithoutFilterSubject$.next(target.value || null)
    }

    /**
     * Clears the input for words with given letters
     */
    clearWordsWithInput(): void {
        this.wordsWithInput.nativeElement.value = ''
        this.wordsWithFilterSubject$.next('')
    }

    /**
     * Clears the input for words without given letters
     */
    clearWordsWithoutInput(): void {
        this.wordsWithoutInput.nativeElement.value = ''
        this.wordsWithoutFilterSubject$.next('')
    }

    /**
     * Pushes a value to the refreshWordList$ observable to complete / refresh the word list observable
     */
    notifyWordListRefresh(): void {
        console.log('notifying refresh')
        this.refreshWordList$.next('refresh')
    }

    /**
     * Initializes the word list
     */
    initializeWordList(): void {

        console.log('initializing word list')

        // subscribe to random words service
        this.randomWordsService.getWords(9)

        // run until refreshWordList pushes a value, then, the function calls itself
            .subscribe((responseWords: string[]) => {
                console.log('responseWords:', responseWords)
                this.wordsToFilter = responseWords.map(
                    (word: string) => ({
                        word,
                        visibility: true,
                    })
                )

                // notify the words are fetched
                this.wordsFetched$.next('fetched')
            })
    }

    //* ------------------------- PRIVATE METHODS ------------------------- *//

    /**
     * Sets up the pipe and subscription to the word filter observables
     * @returns Subscription to the mock server service
     */
    private setupWordFilterPanel(): Subscription {

        // combine the two behavior subjects
        return combineLatest([
            this.wordsWithFilterSubject$,
            this.wordsWithoutFilterSubject$
        ])
            .pipe(
                takeUntil(this.refreshWordList$),
                finalize(() => {
                    console.log('complete')
                    this.initializeWordList()
                    this.setupWordFilterPanel()
                })
            )
            // wait until the API has returned the word data
            .pipe(
                skipUntil(this.wordsFetched$)
            )

            // subscribe to the combined observables
            .subscribe(
                ([
                    lettersToShowWords,
                    lettersToHideWords
                ]: (string | null)[]) => {

                    // filter wordsToFilter based on the letters in the inputs
                    this.wordsToFilter = this.wordsToFilter.map(
                        ({ word, }) => {

                            // Show a word if it contains all the passed letters
                            const showWordBecauseContainsAllLetters: boolean = lettersToShowWords
                                ?.split('')
                                .every((letter: string) => word.includes(letter))
                                ?? true

                            // Hide a word if it contains any of the passed letters
                            const hideWordBecauseContainsAnyLetter: boolean = lettersToHideWords
                                ?.split('')
                                .some((letter: string) => word.includes(letter))
                                ?? false

                            // return the final object
                            return {
                                word,
                                visibility: showWordBecauseContainsAllLetters && !hideWordBecauseContainsAnyLetter,
                            }
                        }
                    )
                }
            )
    }
}
