import { TestBed } from '@angular/core/testing';
import { ProductRowComponent } from './product-row.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as selectors from '../../../../store/selectors';
import { mockProduct } from '../../../../store/reducers';

const mockDefaultTax = 21;

describe('ProductRowComponent', () => {
  let component: ProductRowComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProductRowComponent
      ],
      providers: [
        provideMockStore({})
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);

    const fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;

    store.overrideSelector(selectors.selectDefaultTax, mockDefaultTax);
    store.refreshState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set defaultTax on init', () => {
    expect(component.defaultTax).toBe(mockDefaultTax);
  })

  it('should handle onInit when product is undefined', () => {
    const defaultValuesSpy = jest.spyOn(component, "setDefaultFormValues");
    component.product = undefined;
    component.ngOnInit();
    expect(component.isEditActive).toBe(true);
    expect(defaultValuesSpy).toHaveBeenCalled();
  })

  it('should handle onInit when product is defined', () => {
    const defaultValuesSpy = jest.spyOn(component, "setDefaultFormValues");
    component.ngOnInit();
    expect(component.isEditActive).toBe(false);
    expect(defaultValuesSpy).toHaveBeenCalled();
  })

  it('should set isEditActive correctly when product is changed', () => {
    component.product = undefined;
    component.ngOnInit();
    expect(component.isEditActive).toBe(true);
    component.product = mockProduct;
    component.ngOnChanges({
      product: {
        currentValue: mockProduct,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.isEditActive).toBe(false);
  })

  it('should return correct percentage in getTaxPercentage', () => {
    expect(component.getTaxPercentage(mockProduct)).toBe(mockDefaultTax);
    expect(component.getTaxPercentage({
      ...mockProduct,
      customTax: 10
    })).toBe(10);
  })

  it('should return corrrect price in getPriceWithTax', () => {
    expect(component.getPriceWithTax(mockProduct)).toBeCloseTo(121, 2);
    expect(component.getPriceWithTax({
      ...mockProduct,
      customTax: 10
    })).toBeCloseTo(110, 2);
  })

  it('should set default values correctly in setDefaultFormValues', () => {
    component.setDefaultFormValues();
    expect(component.productForm.controls.code.value).toBe(mockProduct.code.toString());
    expect(component.productForm.controls.name.value).toBe(mockProduct.name);
    expect(component.productForm.controls.price.value).toBe(mockProduct.basePrice.toString());
    expect(component.productForm.controls.tax.value).toBe('');

    component.product = undefined;
    component.setDefaultFormValues();

    expect(component.productForm.controls.code.value).toBe('');
    expect(component.productForm.controls.name.value).toBe('');
    expect(component.productForm.controls.price.value).toBe('');
    expect(component.productForm.controls.tax.value).toBe('');
  })

  it('should reset and validate in forceFormValidation', () => {
    const markTouchedSpy = jest.spyOn(component.productForm, "markAllAsTouched");
    const updateValiditySpy = jest.spyOn(component.productForm, "updateValueAndValidity");

    component.forceFormValidation();

    expect(markTouchedSpy).toHaveBeenCalled();
    expect(updateValiditySpy).toHaveBeenCalled();
  })

  it('should handle handleEditClicked', () => {
    const defaultValuesSpy = jest.spyOn(component, "setDefaultFormValues");
    const forceValidationSpy = jest.spyOn(component, "forceFormValidation");

    component.handleEditClicked();
    expect(defaultValuesSpy).toHaveBeenCalled();
    expect(forceValidationSpy).toHaveBeenCalled();
    expect(component.isEditActive).toBe(true);
  })

  it('should handle handleEditSaved when form is invalid', () => {
    const editSavedSpy = jest.spyOn(component.editSaved, "emit");
    const forceValidationSpy = jest.spyOn(component, "forceFormValidation");
    component.isFormValid = jest.fn(() => false);
    component.isEditActive = true;

    component.handleEditSaved();

    expect(component.isEditActive).toBe(true);
    expect(editSavedSpy).not.toHaveBeenCalled();
    expect(forceValidationSpy).toHaveBeenCalled();
  })

  it('should handle handleEditSaved when form is valid', () => {
    const editSavedSpy = jest.spyOn(component.editSaved, "emit");
    const forceValidationSpy = jest.spyOn(component, "forceFormValidation");
    const resetControlsSpy = jest.spyOn(component, "resetControls");
    component.setDefaultFormValues();
    component.productForm.controls.name.setValue('Test Product Edited');
    component.isFormValid = jest.fn(() => true);
    component.isEditActive = true;

    component.handleEditSaved();

    expect(forceValidationSpy).not.toHaveBeenCalled();
    expect(component.isEditActive).toBe(false);
    expect(editSavedSpy).toHaveBeenCalledWith({
      ...mockProduct,
      name: 'Test Product Edited'
    });
    expect(resetControlsSpy).toHaveBeenCalled();
  })

  it('should handle handleEditCancelled', () => {
    const editCancelledSpy = jest.spyOn(component.editCancelled, "emit");
    const resetControlsSpy = jest.spyOn(component, "resetControls");
    component.isEditActive = true;

    component.handleEditCancelled();
    
    expect(editCancelledSpy).toHaveBeenCalled();
    expect(resetControlsSpy).toHaveBeenCalled();
    expect(component.isEditActive).toBe(false);
  })

  it('should handle handleRemoveClicked', () => {
    const productRemovedSpy = jest.spyOn(component.productRemoved, "emit");

    component.handleRemoveClicked();

    expect(productRemovedSpy).toHaveBeenCalledWith(mockProduct.id);
  })

  it('should hanlde resetControls', () => {
    const formResetSpy = jest.spyOn(component.productForm, "reset");

    component.resetControls();

    expect(formResetSpy).toHaveBeenCalled();
  })
});
