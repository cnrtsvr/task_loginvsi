import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BillingComponent } from './billing.component';
import { MockHomeComponent } from '../home/home.mock.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { mockProduct } from '../../store/reducers';
import * as selectors from '../../store/selectors';
import { PathConstants, routes } from '../../app-routing.module';
import { Router } from '@angular/router';

const mockProducts = [
  mockProduct
];

const mockSubTotal = 100;
const mockSubTotalWithTax = 121;
const mockDefaultTax = 21;

describe('BillingComponent', () => {
  let component: BillingComponent;
  let store: MockStore;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: PathConstants.Home,
            component: MockHomeComponent
          }
        ])
      ],
      declarations: [
        BillingComponent
      ],
      providers: [
        provideMockStore({})
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectors.selectAddedProducts, mockProducts);
    store.overrideSelector(selectors.selectDefaultTax, mockDefaultTax);
    store.overrideSelector(selectors.selectSubTotal, mockSubTotal);
    store.overrideSelector(selectors.selectSubTotalWithTax, mockSubTotalWithTax);

    store.refreshState();

    const fixture = TestBed.createComponent(BillingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set store values on init', () => {
    expect(component.addedProducts).toEqual(mockProducts);
    expect(component.defaultTax).toBe(mockDefaultTax);
    expect(component.subTotal).toBe(mockSubTotal);
    expect(component.subTotalWithTax).toBe(mockSubTotalWithTax);
  })

  it('should calculate effective tax correctly', () => {
    expect(component.getEffectiveTax(mockProduct)).toBeCloseTo(mockDefaultTax / 100, 2);
    expect(component.getEffectiveTax({
      ...mockProduct,
      customTax: 10
    })).toBeCloseTo(0.1, 2);
  })

  it('should handle handleClickBack', () => {
    const navigateSpy = jest.spyOn(router, "navigate");
    component.handleClickBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/', PathConstants.Home]);
  })
});
