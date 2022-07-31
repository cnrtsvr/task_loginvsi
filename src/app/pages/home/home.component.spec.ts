import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { MockProductListComponent } from './components/product-list/product-list.mock.component'
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as selectors from '../../store/selectors';
import { mockProduct } from '../../store/reducers';
import { Router } from '@angular/router';
import { PathConstants } from '../../app-routing.module'
import { MockBillingComponent } from "../billing/billing.mock.component"
import { Product } from 'src/app/types/product';

const mockAddedProducts: Product[] = [
  mockProduct
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: PathConstants.Billing,
          component: MockBillingComponent
        }])
      ],
      declarations: [
        HomeComponent,
        MockProductListComponent
      ],
      providers: [
        provideMockStore({})
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectors.selectAddedProducts, mockAddedProducts);
    store.refreshState();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set addedProducts on init', () => {
    expect(component.addedProducts).toEqual(mockAddedProducts);
  })

  it('should navigate to /billing when handleContinue called', () => {
    const spy = jest.spyOn(router, "navigate");
    component.handleContinue();
    expect(spy).toHaveBeenCalledWith(["/", PathConstants.Billing])
  })
});
