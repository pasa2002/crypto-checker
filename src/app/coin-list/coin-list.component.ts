import { Component, OnInit , AfterViewInit, ViewChild ,ElementRef} from '@angular/core';
import { ApiService } from '../service/api.service';
import {MatPaginator, MatPaginatorModule,PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit,AfterViewInit{

  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api:ApiService,
              private router:Router,
              private currencyService: CurrencyService){}
  bannerData : any=[];
  coinData : any = [];
  currency:string="EUR";
  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    this.currencyService.getCurrency()
    .subscribe(val=>{
      this.currency=val;
      this.getAllData();
      this.getBannerData();
    })
  }

  @ViewChild('coinListContainer') coinListContainer!: ElementRef;

  ngAfterViewInit() {
    // Accessing the DOM element after the view has been initialized
    console.log(this.coinListContainer.nativeElement);
  }

  scrollToCoinList() {
    // Using native scrollIntoView method to scroll to the container
    this.coinListContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  getBannerData(){
    this.api.getTrendingCurency(this.currency)
    .subscribe(res=>{
      console.log("banner data", res);
      this.bannerData = res;
    })
  }

  getAllData(){
    this.api.getCurrencyData(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.coinData = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  redirectToDetail(row: any) {
    this.router.navigate(['coin-detail',row.id])
  }

  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}

