import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
        display: 'none'
      })),
      transition('show <=> hide', [
        animate('225ms')
      ])
    ])
  ]
})

export class CalculatorComponent implements OnInit {
  popupMessage: string = '';
  showPopup: boolean = false;
  isValidCoinId: boolean = false;
  isValidAmount: boolean = false;
  isValidTargetCurrency: boolean = false;

  coinId: string = '';  // e.g. 'bitcoin'
  amount: number = 0;
  targetCurrency: string = '';  // e.g. 'usd'
  conversionResult: number | null = null;

  cryptoList: any[] = [];
  fiatCurrencies: string[] = ['usd', 'eur', 'gbp', 'jpy', 'cad'];

  constructor(private apiService: ApiService) {}

  areInputsValid(): boolean {
    return this.isValidCoinId && this.isValidAmount && this.isValidTargetCurrency;
  }

  validateCoinId() {
    this.isValidCoinId = !!this.coinId;
  }

  validateAmount() {
    this.isValidAmount = this.amount > 0;
  }

  validateTargetCurrency() {
    this.isValidTargetCurrency = !!this.targetCurrency;
  }

  ngOnInit() {
    this.apiService.getAllCryptocurrencies().subscribe(data => {
      this.cryptoList = data;
      this.validateCoinId();
      this.validateAmount();
      this.validateTargetCurrency();
    });
  }


  convertCurrency() {
    if (!this.areInputsValid()) {
      this.showFeedback();
      return;
    }

    this.apiService.getConversionRate(this.coinId, this.targetCurrency)
      .subscribe(data => {
        const rate = data[this.coinId][this.targetCurrency];
        this.conversionResult = this.amount * rate;
      }, error => {
        console.error("Failed to fetch conversion rate:", error);
        // Handle the error here (e.g., show an error message to the user)
      });
  }

  showFeedback() {
    if (!this.isValidCoinId) {
      this.popupMessage = 'Please select a cryptocurrency.';
    } else if (!this.isValidAmount) {
      this.popupMessage = 'Please enter an amount.';
    } else if (!this.isValidTargetCurrency) {
      this.popupMessage = 'Please select a target currency.';
    }
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 2250); // 2.25 seconds to match the duration of the animation
  }

}
