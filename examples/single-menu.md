# NFC

## Detect card

- Activating RF field and wait for card. 
Run tests when card found.
- Found match
  - Mifare Classic found.
Run Mifare reader? 
- No found
  - Cannot detect card type  

## Reader detector

- Passive listen for WUPA/REQA-B
  - Commands live stream 
    0x26
    0x26
    0x26
- Start active emulating 
- .
  - Mifare reader found
- .
  - EMV reader found

## Read card

- Mifare Classic
- Mifare Ultralight
- EMV get PAN
- what more?

## Saved dumps

- mfc_a6b804bf
- home
- mfu_04bfac72
- emv_paywave_1007

## USB NFC Reader

- Activates instantly.
No more display updates