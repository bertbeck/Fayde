module Fayde {
    export class RoutedEventArgs implements nullstone.IEventArgs {
        Handled: boolean = false;
        Source: any = null;
        OriginalSource: any = null;
    }
    Fayde.RegisterType(RoutedEventArgs, "Fayde", Fayde.XMLNS);
}