export enum ACTIONCARD_TYPE {
    Arguments= "Arguments",
    TargetedArguments = "TargetedArguments",
    Goodies = "Goodies",
    Hijacking = "Hijacking",
    CounterArgument = "CounterArgument",
    Investigation = "Investigation",
    MakeDisappear = "MakeDisappear",
    Security = "Security"
}

export const ACTIONCARD_TEXT = [
    {type: ACTIONCARD_TYPE.Arguments, text: 'Move up 2 visitors'},
    {type: ACTIONCARD_TYPE.TargetedArguments, text: 'Move down 1 visitor, then move up another visitor'},
    {type: ACTIONCARD_TYPE.Goodies, text: 'Move up 2 visitors of 2 cells'},
    {type: ACTIONCARD_TYPE.Hijacking, text: 'Move a visitor to the left or right'},
    {type: ACTIONCARD_TYPE.CounterArgument, text: 'Move down 2 visitors'},
    {type: ACTIONCARD_TYPE.Investigation, text: 'Watch the value of a visitor'},
    {type: ACTIONCARD_TYPE.MakeDisappear, text: 'Remove a visitor'},
    {type: ACTIONCARD_TYPE.Security, text: 'Take the security token'},
]