#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

static NSString * const DISPATCH_REDUX_ACTION = @"DISPATCH_REDUX_ACTION";

@interface ExternalAPI : RCTEventEmitter<RCTBridgeModule>
@end
