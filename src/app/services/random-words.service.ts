import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class RandomWordsService {

    /**
     * Constructor
     */
    // eslint-disable-next-line no-unused-vars
    constructor(private http: HttpClient) {}

    /**
     * Gets a number of random words
     * @param numberOfWords number of words to fetch
     * @returns an array of words
     */
    public getWords(numberOfWords: number): Observable<string[]> {
        const requestUrl: string = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}&swear=0`
        return this.http.get<string[]>(requestUrl)
    }
}
