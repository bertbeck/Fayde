/// <reference path="qunit-1.10.0.d.ts" />
/// <reference path="../Typescript/Core/DependencyObject.ts" />
/// <reference path="../Typescript/Core/Providers/BasicProviderStore.ts" />
/// <reference path="../Typescript/Core/UIElement.ts" />
/// <reference path="../Typescript/Core/Providers/InheritedProvider.ts" />
var Mock1Property = DependencyProperty.Register("Mock1", function () {
    return String;
}, Fayde.DependencyObject);
var Mock2Property = DependencyProperty.Register("Mock2", function () {
    return String;
}, Fayde.DependencyObject, "Default");
test("ProviderStoreTests.BasicProvider", function () {
    var d = new Fayde.DependencyObject();
    var store = d._Store;
    var val;
    val = store.ReadLocalValue(Mock1Property);
    ok(val instanceof Fayde.UnsetValue, "ReadLocalValue (Mock1) should return UnsetValue since value has not been set.");
    store.SetValue(Mock1Property, "Modified");
    val = store.GetValue(Mock1Property);
    strictEqual(val, "Modified", "GetValue (Mock1) should return value from local value provider after a SetValue.");
    val = store.GetValue(Mock2Property);
    strictEqual(val, "Default", "Initial GetValue (Mock2) should return value from default value provider.");
    store.SetValue(Mock2Property, "Modified");
    val = store.GetValue(Mock2Property);
    strictEqual(val, "Modified", "GetValue (Mock2) should return value from local value provider after a SetValue.");
    val = store.ClearValue(Mock2Property);
    val = store.GetValue(Mock2Property);
    strictEqual(val, "Default", "GetValue (Mock2) after ClearValue should revert to using default value provider.");
});
test("ProviderStoreTests.InheritedProviderStore", function () {
    var root = new Fayde.FrameworkElement();
    var rootStore = root._Store;
    var child = new Fayde.FrameworkElement();
    var childStore = child._Store;
    rootStore.SetValue(Fayde.UIElement.UseLayoutRoundingProperty, false);
    var val = childStore.GetValue(Fayde.UIElement.UseLayoutRoundingProperty);
    strictEqual(val, true, "Inherited property that hasn't been propagated should default to true.");
    var error = new BError();
    ok(root.XamlNode.AttachVisualChild(child, error), "Attaching child to root should not fail: " + error.Message);
    val = childStore.GetValue(Fayde.UIElement.UseLayoutRoundingProperty);
    strictEqual(val, false, "Inherited property should be propagated from root to false.");
    rootStore.ClearValue(Fayde.UIElement.UseLayoutRoundingProperty);
    val = childStore.GetValue(Fayde.UIElement.UseLayoutRoundingProperty);
    strictEqual(val, true, "Inherited property should be reset to true after value at root is cleared.");
});
test("ProviderStoreTests.FrameworkProviderStore", function () {
    var root = new Fayde.FrameworkElement();
    var rootStore = root._Store;
    var child = new Fayde.FrameworkElement();
    var childStore = child._Store;
    //Test inherited DataContext
    var effectiveDataContext = {
    };
    rootStore.SetValue(Fayde.DependencyObject.DataContextProperty, effectiveDataContext);
    var val = childStore.GetValue(Fayde.DependencyObject.DataContextProperty);
    strictEqual(val, undefined, "Child DataContext should be undefined before attaching to tree.");
    var error = new BError();
    ok(root.XamlNode.AttachVisualChild(child, error), "Attaching child to root should not fail: " + error.Message);
    val = childStore.GetValue(Fayde.DependencyObject.DataContextProperty);
    strictEqual(val, effectiveDataContext, "Child DataContext should inherit DataContext from root after attaching to tree.");
    rootStore.ClearValue(Fayde.DependencyObject.DataContextProperty, true);
    val = childStore.GetValue(Fayde.DependencyObject.DataContextProperty);
    strictEqual(val, undefined, "Child DataContext should be undefined after clearing root DataContext value.");
    //Test implicit style
    val = childStore.GetValue(Fayde.UIElement.TagProperty);
    strictEqual(val, undefined, "Child Tag should be undefined by default.");
    var visualTreeStyle = new Fayde.Style();
    visualTreeStyle.TargetType = Fayde.FrameworkElement;
    var s1 = new Fayde.Setter();
    s1.Property = Fayde.UIElement.TagProperty;
    s1.Value = "TagValue";
    visualTreeStyle.Setters.Add(s1);
    childStore.SetImplicitStyles(Fayde.Providers._StyleMask.VisualTree, [
        visualTreeStyle, 
        null, 
        null
    ]);
    val = childStore.GetValue(Fayde.UIElement.TagProperty);
    strictEqual(val, "TagValue", "Child Tag should be \"TagValue\" after setting implicit style.");
    childStore.ClearImplicitStyles(Fayde.Providers._StyleMask.VisualTree);
    val = childStore.GetValue(Fayde.UIElement.TagProperty);
    strictEqual(val, undefined, "Child Tag should be undefined after clearing implicit style.");
    childStore.SetImplicitStyles(Fayde.Providers._StyleMask.VisualTree, [
        visualTreeStyle, 
        null, 
        null
    ]);
    val = childStore.GetValue(Fayde.UIElement.VisibilityProperty);
    strictEqual(val, Fayde.Visibility.Visible, "Child Visibility should default to Visible.");
    //Test local style
    var localStyle = new Fayde.Style();
    var s2 = new Fayde.Setter();
    s2.Property = Fayde.UIElement.TagProperty;
    s2.Value = "Overridden Value";
    localStyle.Setters.Add(s2);
    var s3 = new Fayde.Setter();
    s3.Property = Fayde.UIElement.VisibilityProperty;
    s3.Value = "Collapsed";
    localStyle.Setters.Add(s3);
    var error = new BError();
    childStore.SetLocalStyle(localStyle, error);
    val = childStore.GetValue(Fayde.UIElement.VisibilityProperty);
    strictEqual(val, Fayde.Visibility.Collapsed, "Child Visibility should have changed to default by local style.");
    val = childStore.GetValue(Fayde.UIElement.TagProperty);
    strictEqual(val, "Overridden Value", "Child Tag property should be overriden by a new local style over the implicit style.");
    childStore.SetLocalStyle(new Fayde.Style(), error);
    val = childStore.GetValue(Fayde.UIElement.VisibilityProperty);
    strictEqual(val, Fayde.Visibility.Visible, "After a new style is applied without Visibility property, Visibility revert to default value.");
});
//@ sourceMappingURL=ProviderStoreTests.js.map
