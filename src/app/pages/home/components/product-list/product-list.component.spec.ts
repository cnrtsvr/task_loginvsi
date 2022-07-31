import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { MockProductRowComponent } from '../product-row/product-row.mock.component'
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as selectors from '../../../../store/selectors';
import { mockProduct } from '../../../../store/reducers';
import * as actions from '../../../../store/actions';

const mockProducts = [
  mockProduct
];

const mockSubTotal = 100;
const mockSubTotalWithTax = 121;
const mockDefaultTax = 21;

const mockNewDefaultTax = 10;
const mockNewSubTotalWithTax = 110;
const mockNewProduct = {
  ...mockProduct,
  name: 'Test Product 2',
  id: undefined
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProductListComponent,
        MockProductRowComponent
      ],
      providers: [
        provideMockStore({})
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, "dispatch");

    store.overrideSelector(selectors.selectSubTotal, mockSubTotal);
    store.overrideSelector(selectors.selectSubTotalWithTax, mockSubTotalWithTax);
    store.overrideSelector(selectors.selectDefaultTax, mockDefaultTax);

    store.refreshState();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    component.products = mockProducts;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set store values on init', () => {
    expect(component.subTotal).toBe(mockSubTotal);
    expect(component.subTotalWithTax).toBe(mockSubTotalWithTax);
    expect(component.defaultTax).toBe(mockDefaultTax);
  })

  it('should handle handleAddButtonClick', () => {
    component.handleAddButtonClick();
    expect(component.isAddingProduct).toBe(true);
  })

  it('should handle handleEditTaxClick', () => {
    component.handleEditTaxClick();

    expect(component.taxControl.value).toBe(mockDefaultTax.toString());
    expect(component.isEditTaxActive).toBe(true);
  })

  it('should handle handleSaveDefaultTax', () => {
    component.isEditTaxActive = true;
    const controlResetSpy = jest.spyOn(component.taxControl, "reset");
    component.taxControl.setValue(mockNewDefaultTax.toString());
    component.handleSaveDefaultTax();
    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.setDefaultTax({ defaultTax: mockNewDefaultTax })
    );
    expect(component.isEditTaxActive).toBe(false);
    expect(controlResetSpy).toHaveBeenCalled();
  })

  it('should handle handleCancelEditTax', () => {
    component.isEditTaxActive = true;
    const controlResetSpy = jest.spyOn(component.taxControl, "reset");

    component.handleCancelEditTax();

    expect(component.isEditTaxActive).toBe(false);
    expect(controlResetSpy).toHaveBeenCalled();
  })

  it('should handle handleNewProductAdded', () => {
    component.isAddingProduct = true;
    component.handleNewProductAdded(mockNewProduct);

    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.addProduct({ product: mockNewProduct })
    );
    expect(component.isAddingProduct).toBe(false);
  })

  it('should handle handleNewProductCancelled', () => {
    component.isAddingProduct = true;
    component.handleNewProductCancelled();

    expect(component.isAddingProduct).toBe(false);
  })

  it('should handle handleProductEdited', () => {
    component.handleProductEdited({
      ...mockProduct,
      name: 'NEW NAME'
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.updateProduct({
        product: {
          ...mockProduct,
          name: 'NEW NAME'
        }
      })
    );
  })

  it('should handle handleProductRemoved', () => {
    component.handleProductRemoved(1);

    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.removeProduct({ id: 1 })
    );
  })
});
