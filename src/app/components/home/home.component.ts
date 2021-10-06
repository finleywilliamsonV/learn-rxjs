import { Component, OnInit } from '@angular/core'
import { faAngry as faAngryReg } from '@fortawesome/free-regular-svg-icons'
import { faAngry, faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs'
import { MockServerService } from '../../services/mock-server.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // set the fa icon vars
    public faCoffee: IconDefinition = faCoffee
    public faAngry: IconDefinition = faAngry
    public faAngryReg: IconDefinition = faAngryReg

    // array of responses
    public serverResponses: string[]

    // initialized in onInit
    public serverSubscription!: Subscription

    // eslint-disable-next-line no-unused-vars
    constructor(private mockServer: MockServerService) {
        this.serverResponses = []
    }

    ngOnInit(): void {
        // subscribe to the server responses
        this.serverSubscription = this.mockServer.serverResponses.subscribe(
            (message: string) => {
                this.serverResponses.push(message)
            }
        )
    }

    //* PUBLIC METHODS *//

    sendOneRequest(): void {
        this.serverResponses = []
        console.log('\nsending one request')
        this.mockServer.singleRequest()
    }

    sendFiveRequests(): void {
        this.serverResponses = []
        console.log('\nsending five requests')
        this.mockServer.multiRequest(5)
    }
}
