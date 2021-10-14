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
export class HomeComponent implements OnInit {

    // set the fa icon vars
    public faCoffee: IconDefinition = faCoffee
    public faAngry: IconDefinition = faAngry
    public faAngryReg: IconDefinition = faAngryReg

    // Words for words filter panel
    public wordsToFilter: {
        word: string,
        visibility: boolean
    }[]

    // word filter observables
    private readonly wordsWithFilterSubject$: BehaviorSubject<string | null>
    private readonly wordsWithoutFilterSubject$: BehaviorSubject<string | null>

    // view children
    @ViewChild('wordsWithInput')
    private wordsWithInput!: ElementRef<HTMLInputElement>

    @ViewChild('wordsWithoutInput')
    private wordsWithoutInput!: ElementRef<HTMLInputElement>

    /**
     * Constructor function
     * @param mockServer
     */
    // eslint-disable-next-line no-unused-vars
    constructor() {

        // initialize word filter vars
        this.wordsWithFilterSubject$ = new BehaviorSubject<string | null>(null)
        this.wordsWithoutFilterSubject$ = new BehaviorSubject<string | null>(null)
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
        const nextValue: string | null = target.value === '' ? null : target.value
        this.wordsWithFilterSubject$.next(nextValue)
    }

    /**
     * Pushes the next string to the observable
     * @param $event
     */
    onWordsWithoutChange($event: Event): void {
        const target: HTMLInputElement = $event.target as HTMLInputElement
        const nextValue: string | null = target.value === '' ? null : target.value
        this.wordsWithoutFilterSubject$.next(nextValue)
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
        ]).subscribe(
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
